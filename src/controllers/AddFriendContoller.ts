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
                    return res.send({ message: `Demand ${id} doesn't exists` })
                }
                res.send({ message: `Demand: ${id} deleted` })
            } else {
                await RequestToUser.deleteMany()
                res.send({ message: `All Demand have been deleted` })
            }
        } catch (e) {
            console.log(e)
            res.status(400).send({ message: `Wild error appeared` })
        }
    }
    static remove = async (req: Request, res: Response) => {
        const { id } = req.params
        const user = res.locals.payload

        const me = await User.findById(user.id)
        const friend = await User.findById(me.friendList)
        

        try {
            let filteredMe = await me.friendList.filter(friend => {
                if (friend == id) {
                    console.log(friend);
                    me.friendList.remove(friend);
                }
            })
            let filteredFriend = await friend.friendList.filter(me => {
                if (me == me) {
                    console.log(me);
                    friend.friendList.remove(me);
                }
                
            })
            

            await me.save();
            await friend.save();

            res.send({filteredMe,filteredFriend, message: `RequestToUser: ${id} deleted 😢` })
           
        } catch (e) {
            console.log(e)
            res.status(400).send({message: `Oups ${id} you already delete this friend or you aren't friend to delete 🤕` })
        }
    }
    static accept = async (req: Request, res: Response) => {
        const { id } = req.params
        const user = res.locals.payload

        try {
            const demand = await RequestToUser.findOne({id});
            const me = await User.findById(user.id)
            const friend = await User.findById(demand.fromUser)
            const findFriend = me.friendList.includes(friend);
            console.log(findFriend);
            

            let accept = demand.accepted;

            if (accept === false && findFriend === false) {
                console.log(`Pas d'amis trouvé dans la liste qui correspond à l'id : ${friend.id}`);

                demand.accepted = true;
                const result = await demand.save();
                
                me.friendList.push(friend.id)
                await me.save()
                friend.friendList.push(me.id)
                await friend.save()

                const request = await RequestToUser.deleteOne({ "_id" : demand.id })
                
                if (request.deletedCount === 0) {
                    return res.send({ message: `Demand doesn't exists` })
                }
                return res.send({me,friend,message: `Demand: ${id} deleted`})
                
            } else {
                return res.status(400).send({ message: "Demand is already accepted 😘 or Friend already exist in your friend list" })
            }
        } catch (e) {
            console.log(e)
            res.status(400).send(e)
        }
    }
}