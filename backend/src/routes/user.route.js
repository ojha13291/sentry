import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import { 
    acceptFriendRequest,
    rejectFriendRequest,
    getMyFriends,
    getFriendRequests,
    getRecommendatedUsers,
    sendFriendRequest,
    getOutgoingFriendReqs
} from '../controllers/user.controller.js';


const router = express.Router();

router.use(protectRoute);
// apply auth middleware to all routes below
router.get('/', getRecommendatedUsers);
router.get('/friends', getMyFriends);

router.post('/friend-request/:id', sendFriendRequest);
router.put('/friend-request/:id/accept', acceptFriendRequest);
router.put('/friend-request/:id/reject', rejectFriendRequest);

router.get('/friend-requests', getFriendRequests);
router.get('/outgoing-friend-requests/:id', getOutgoingFriendReqs);

export default router;