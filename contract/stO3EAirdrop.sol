// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface IERC20 {
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    function transfer(address to, uint256 value) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint256);
    function approve(address spender, uint256 value) external returns (bool);
    function transferFrom(address from, address to, uint256 value) external returns (bool);
}

error OKAirdropTransfer__NotOwner();
error OKAirdropTransfer__NotAuthorized();
error OKAirdropTransfer__InsufficientTokenBalance();
error OKAirdropTransfer__MaxAirdropReached();

contract OKAirdrop {
    uint256 public constant AIRDROP_AMOUNT = 50000 * 10 ** 18; // Cố định 50000 token mỗi lần claim
    uint256 public constant MAX_AIRDROP_AMOUNT = 100001 * 10 ** 18; // Tối đa mỗi địa chỉ ví nhận được 100001 token
    address private immutable i_owner;
    IERC20 private immutable i_O3EToken;
    mapping(address => uint256) private s_addressToAirdroppedAmount;
    address[] private s_authorizedAddresses;

    modifier onlyOwner() {
        if (msg.sender != i_owner) revert OKAirdropTransfer__NotOwner();
        _;
    }

    modifier onlyAuthorized() {
        bool isAuthorized = false;
        for (uint256 i = 0; i < s_authorizedAddresses.length; i++) {
            if (msg.sender == s_authorizedAddresses[i]) {
                isAuthorized = true;
                break;
            }
        }
        if (!isAuthorized && msg.sender != i_owner) revert OKAirdropTransfer__NotAuthorized();
        _;
    }

    constructor(address O3ETokenAddress) {
        i_O3EToken = IERC20(O3ETokenAddress);
        i_owner = msg.sender;
    }

    // Hàm để claim token O3E, mỗi lần 50000 token, nhưng không vượt quá 100001 token cho mỗi địa chỉ
    function airdrop() public {
        uint256 alreadyAirdropped = s_addressToAirdroppedAmount[msg.sender];

        // Kiểm tra nếu địa chỉ ví đã nhận tối đa 100001 O3E
        if (alreadyAirdropped >= MAX_AIRDROP_AMOUNT) {
            revert OKAirdropTransfer__MaxAirdropReached();
        }

        // Kiểm tra số lượng token còn lại hợp lệ để airdrop (không vượt quá MAX_AIRDROP_AMOUNT)
        uint256 airdropableAmount = AIRDROP_AMOUNT;
        if (alreadyAirdropped + AIRDROP_AMOUNT > MAX_AIRDROP_AMOUNT) {
            airdropableAmount = MAX_AIRDROP_AMOUNT - alreadyAirdropped;
        }

        // Kiểm tra số dư của hợp đồng đủ để chuyển token
        uint256 contractBalance = i_O3EToken.balanceOf(address(this));
        if (contractBalance < airdropableAmount) {
            revert OKAirdropTransfer__InsufficientTokenBalance();
        }

        // Cập nhật số lượng token mà địa chỉ đã nhận
        s_addressToAirdroppedAmount[msg.sender] += airdropableAmount;

        // Chuyển token O3E cho người gọi
        bool success = i_O3EToken.transfer(msg.sender, airdropableAmount);
        require(success, "Token transfer failed");
    }

    // Hàm để thiết lập danh sách địa chỉ được ủy quyền
    function setAuthorizedAddresses(address[] memory authorizedAddresses) public onlyOwner {
        s_authorizedAddresses = authorizedAddresses;
    }

    // Hàm kiểm tra số dư O3E của hợp đồng
    function getContractO3EBalance() public view returns (uint256) {
        return i_O3EToken.balanceOf(address(this));
    }

    // Hàm kiểm tra số dư O3E của một địa chỉ ví cụ thể
    function getWalletO3EBalance(address wallet) public view returns (uint256) {
        return i_O3EToken.balanceOf(wallet);
    }

    // Getter function kiểm tra số lượng token đã airdrop bởi địa chỉ ví
    function getAirdroppedAmount(address _address) public view returns (uint256) {
        return s_addressToAirdroppedAmount[_address];
    }

    // Getter function để lấy thông tin chủ sở hữu hợp đồng
    function getOwner() public view returns (address) {
        return i_owner;
    }

    // Getter function để lấy thông tin về token O3E
    function getO3EToken() public view returns (IERC20) {
        return i_O3EToken;
    }
}

