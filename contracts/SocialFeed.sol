// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title SocialFeed
 * @dev Decentralized social media contract for Arc Network
 * All interactions (posts, likes, comments, shares) are on-chain
 * Gas fees paid in USDC on Arc Network
 */
contract SocialFeed {
    struct Post {
        uint256 id;
        address author;
        string contentHash; // IPFS hash or content identifier
        string contentType; // "text", "image", "video", "mixed"
        string[] mediaUrls; // IPFS/Arweave URLs
        uint256 timestamp;
        uint256 likes;
        uint256 comments;
        uint256 shares;
    }

    struct Comment {
        uint256 id;
        uint256 postId;
        address commenter;
        string content;
        uint256 timestamp;
    }

    uint256 private postCounter;
    uint256 private commentCounter;

    mapping(uint256 => Post) public posts;
    mapping(uint256 => Comment[]) public postComments;
    mapping(uint256 => mapping(address => bool)) public postLikes;
    mapping(address => uint256[]) public userPosts;

    event PostCreated(uint256 indexed postId, address indexed author, string contentHash, uint256 timestamp);
    event PostLiked(uint256 indexed postId, address indexed user);
    event PostUnliked(uint256 indexed postId, address indexed user);
    event CommentAdded(uint256 indexed postId, uint256 indexed commentId, address indexed commenter, string content);
    event PostShared(uint256 indexed postId, address indexed user);

    /**
     * @dev Create a new post
     */
    function createPost(
        string memory contentHash,
        string memory contentType,
        string[] memory mediaUrls
    ) external payable returns (uint256) {
        postCounter++;
        uint256 postId = postCounter;

        posts[postId] = Post({
            id: postId,
            author: msg.sender,
            contentHash: contentHash,
            contentType: contentType,
            mediaUrls: mediaUrls,
            timestamp: block.timestamp,
            likes: 0,
            comments: 0,
            shares: 0
        });

        userPosts[msg.sender].push(postId);

        emit PostCreated(postId, msg.sender, contentHash, block.timestamp);
        return postId;
    }

    /**
     * @dev Like a post
     */
    function likePost(uint256 postId) external payable {
        require(posts[postId].id != 0, "Post does not exist");
        require(!postLikes[postId][msg.sender], "Already liked");

        postLikes[postId][msg.sender] = true;
        posts[postId].likes++;

        emit PostLiked(postId, msg.sender);
    }

    /**
     * @dev Unlike a post
     */
    function unlikePost(uint256 postId) external payable {
        require(posts[postId].id != 0, "Post does not exist");
        require(postLikes[postId][msg.sender], "Not liked yet");

        postLikes[postId][msg.sender] = false;
        posts[postId].likes--;

        emit PostUnliked(postId, msg.sender);
    }

    /**
     * @dev Add a comment to a post
     */
    function addComment(uint256 postId, string memory content) external payable returns (uint256) {
        require(posts[postId].id != 0, "Post does not exist");

        commentCounter++;
        uint256 commentId = commentCounter;

        Comment memory newComment = Comment({
            id: commentId,
            postId: postId,
            commenter: msg.sender,
            content: content,
            timestamp: block.timestamp
        });

        postComments[postId].push(newComment);
        posts[postId].comments++;

        emit CommentAdded(postId, commentId, msg.sender, content);
        return commentId;
    }

    /**
     * @dev Share a post
     */
    function sharePost(uint256 postId) external payable {
        require(posts[postId].id != 0, "Post does not exist");

        posts[postId].shares++;

        emit PostShared(postId, msg.sender);
    }

    /**
     * @dev Get post by ID
     */
    function getPost(uint256 postId) external view returns (Post memory) {
        require(posts[postId].id != 0, "Post does not exist");
        return posts[postId];
    }

    /**
     * @dev Get all posts from a user
     */
    function getUserPosts(address user) external view returns (uint256[] memory) {
        return userPosts[user];
    }

    /**
     * @dev Get comments for a post
     */
    function getPostComments(uint256 postId) external view returns (Comment[] memory) {
        return postComments[postId];
    }

    /**
     * @dev Check if user has liked a post
     */
    function hasLiked(uint256 postId, address user) external view returns (bool) {
        return postLikes[postId][user];
    }

    /**
     * @dev Get total number of posts
     */
    function getTotalPosts() external view returns (uint256) {
        return postCounter;
    }

    /**
     * @dev Get all post IDs (pagination recommended for production)
     */
    function getAllPosts() external view returns (uint256[] memory) {
        uint256[] memory allPosts = new uint256[](postCounter);
        for (uint256 i = 1; i <= postCounter; i++) {
            allPosts[i - 1] = i;
        }
        return allPosts;
    }
}
