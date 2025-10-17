import User from '../models/User.js';
import FriendRequest from '../models/FriendRequest.js';


export async function getRecommendatedUsers(req, res) {
    try {
        const currentUserId = req.user.id;
        const currentUser = req.user;

        const recommendedUsers = await User.find({
            $and: [
                { _id: { $ne: currentUserId } }, // Exclude current user
                { _id: { $nin: currentUser.friends } }, // Exclude current user's friends
                {isOnboarded: true}
            ]
        })
        res.status(200).json(recommendedUsers);
    } catch (error) {
        console.error('Error in fetching recommended users:', error);
        res.status(500).json({ message: 'Server error' });
    }

}

export async function getMyFriends(req, res) {
    try {
        const user = await User.findById(req.user.id)
        .select('friends')
        .populate('friends', 'fullName profilePic nativeLanguage learningLanguage'); // Populate friends with selected fields

        res.status(200).json(user.friends);
    } catch (error) {
        console.error('Error in fetching friends:', error);
        res.status(500).json({ message: 'Server error' });
    }
}

export async function sendFriendRequest(req, res) {
    try {
        const myId = req.user.id;
        const { id:recipientId} = req.params;
        if(myId === recipientId) {
            return res.status(400).json({message: "You cannot send friend request to yourself"});
        }
        const recipient = await User.findById(recipientId);
        if(!recipient) {
            return res.status(404).json({message: "User not found"});
        }
        // Check if they are already friends
        if(recipient.friends.includes(myId)) {
            return res.status(400).json({message: "You are already friends"});
        }

        // Check if a friend request already exists
        const existingRequest = await FriendRequest.findOne({
            $or: [
                { sender: myId, recipient: recipientId },
                { sender: recipientId, recipient: myId }
            ],
            status: "pending"
        });

        if(existingRequest) {
            return res.status(400).json({message: "A pending friend request already exists between you and this user"});
        }

        const friendRequest = await FriendRequest.create({
            sender: myId,
            recipient: recipientId
        });
        
        res.status(201).json(friendRequest);

    } catch (error) {
        console.error('Error in sending friend request:', error);
        res.status(500).json({ message: 'Server error' });
    }
}

export async function acceptFriendRequest(req, res) {
    try {
        const { id:requestId } = req.params;
        const friendRequest = await FriendRequest.findById(requestId);
        if(!friendRequest) {
            return res.status(404).json({message: "Friend request not found"});
        }

        if(friendRequest.recipient.toString() !== req.user.id) {
            return res.status(403).json({message: "You are not authorized to accept this friend request"});
        }

        friendRequest.status = "accepted";
        await friendRequest.save();

        // Add each other as friends
        // $addToSet : adds a value to an array unless the value is already present, ensuring no duplicates

        await User.findByIdAndUpdate(friendRequest.sender, {
            $addToSet: { friends: friendRequest.recipient }
        });
        await User.findByIdAndUpdate(friendRequest.recipient, {
            $addToSet: { friends: friendRequest.sender }
        });

        res.status(200).json({message: "Friend request accepted"});
    }
    catch (error) {
        console.error('Error in accepting friend request:', error);
        res.status(500).json({ message: 'Server error' });
    }
}

export async function getFriendRequests(req, res) {
    try {
        const incomingReqs = await FriendRequest.find({
            recipient: req.user.id,
            status: "pending"
        }).populate('sender', 'fullName profilePic nativeLanguage learningLanguage'); // Populate sender with selected fields

        const acceptedReqs = await FriendRequest.find({
            recipient: req.user.id,
            status: "accepted"
        }).populate('sender', 'fullName profilePic nativeLanguage learningLanguage'); // Populate sender with selected fields

        res.status(200).json({incomingReqs, acceptedReqs});
    }
    catch (error) {
        console.error('Error in fetching friend requests:', error);
        res.status(500).json({ message: 'Server error' });
    }
}

export async function getOutgoingFriendReqs(req, res) {
    try {
        const outgoingReqs = await FriendRequest.find({
            sender: req.user.id,
            status: "pending"
        }).populate('recipient', 'fullName profilePic nativeLanguage learningLanguage');
        
        res.status(200).json(outgoingReqs);
    }
    catch (error) {
        console.error('Error in fetching outgoing friend requests:', error);
        res.status(500).json({ message: 'Server error' });
    }
}

export async function rejectFriendRequest(req, res) {
    try {
        const { id:requestId } = req.params;
        const friendRequest = await FriendRequest.findById(requestId);
        if(!friendRequest) {
            return res.status(404).json({message: "Friend request not found"});
        }

        if(friendRequest.recipient.toString() !== req.user.id) {
            return res.status(403).json({message: "You are not authorized to reject this friend request"});
        }
        friendRequest.status = "rejected";
        await friendRequest.save(); 
        res.status(200).json({message: "Friend request rejected"});
    }
    catch (error) {
        console.error('Error in rejecting friend request:', error);
        res.status(500).json({ message: 'Server error' });
    }
}
