import { Liveblocks } from "@liveblocks/node";
import { api } from "@/convex/_generated/api";
import { ConvexHttpClient } from "convex/browser";
import { currentUser,auth } from "@clerk/nextjs/server";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);


const liveblocks = new Liveblocks({
    secret: "sk_dev_TL7zNhO0SQJ-DW4Ujgb3UhuZU957EiLVAY4vEbni4DNS_Lkdo24ZpuN752nVijst",
});


export async function POST(request: Request) {
    const authorization = await auth();
    const user = await currentUser();


    if (!authorization || !user) {
        return new Response("Unauthorized", { status: 401 });
    }

    const { room } = await request.json();
    const board = await convex.query(api.board.get, { id: room });

    
    /*if (board?.orgId !== authorization.orgId) {
        return new Response("Unauthorized", { status: 401 });
    }*/

    const userInfo = {
        name: user.firstName || "Anonymous",
        avatar: user.imageUrl!,
        picture: user.imageUrl!,
        
    };

    const session = liveblocks.prepareSession(user.id, {
        userInfo,
    });

    if (room) {
        session.allow(room, session.FULL_ACCESS);
    }

    const { status, body } = await session.authorize();
    console.log({status, body}, "ALLOWED")
    return new Response(body, { status });
};
