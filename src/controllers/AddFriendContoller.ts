import { Request, Response } from "express";
import { RequestToUser } from "../entity/RequestToUser";
import { User } from "../entity/User";

export class AddFriendContoller {
    static demand = async (req: Request, res: Response) => {
        const { id } = req.params
        const user = res.locals.payload

        try {
            if (id != user.id) {
                const futurFriend = await User.findById(id)
                const friend = new RequestToUser({"fromUser":futurFriend.id,"toUser":user.id})
                const result = await friend.save()
                console.log("Moi : "+user.id);
                console.log("Future ami : "+futurFriend.id);
                
                res.send({futurFriend,user})
                
            } else {
                return res.status(400).send({ message: "You cannot add you in friend😅 " })
            }
        } catch (e) {
            console.log(e)
            res.status(400).send(e)
        }
    }
    static list = async (req: Request, res: Response) => {
        const {id} = res.locals.payload
        try {
            
            const friend = await RequestToUser.find({toUser:id}).populate('fromUser').populate('toUser');
            
            console.log("Moi log : ",id);
            console.log("Future ami : ",friend);
            
            return res.send(friend)
        } catch (e) {
            console.log(e)
            res.status(400).send(e)
        }
    }
    static delete = async (req: Request, res: Response) => {
        const { id } = req.params

        try {
            if (id) {
                console.log(id);
                
                const request = await RequestToUser.deleteOne({ _id: id })
                if (request.deletedCount === 0) {
                    return res.send({ message: `RequestToUser doesn't exists` })
                }
                res.send({ message: `RequestToUser: ${id} deleted` })
            } else {
                await RequestToUser.deleteMany()
                res.send({ message: `All RequestToUser have been deleted` })
            }
        } catch (e) {
            console.log(e)
            res.status(400).send({ message: `Wild error appeared` })
        }
    }
    static accept = async (req: Request, res: Response) => {
        const { id } = req.params
        const user = res.locals.payload

        try {
            const demand = await RequestToUser.find({toUser:user.id});
            if (id != user.id) {
                
                

                console.log("Moi : "+user.id);
                console.log("Demand : "+demand);
                
                res.send({demand,user})
                
            } else {
                return res.status(400).send({ message: "Something wrong 🙄" })
            }
        } catch (e) {
            console.log(e)
            res.status(400).send(e)
        }
    }
}