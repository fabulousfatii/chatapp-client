import { useEffect } from "react"

export const useSocketEvents = (event, handler) => {
    useEffect(() => {

        Object.entries(handler).forEach(([event, callback]) => {
            socket.on(event, callback)
               console.log("Registered socket event handlers")

        })


        // return () => {
        //     Object.entries(handler).forEach(([event, callback]) => {
        //         socket.off(event, callback)
        //        console.log("Unregistered socket event handlers")

        //     })
        // }
    }, [socket, handler])

}