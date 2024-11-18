//Users/harithagampala/board-video/app/text-editor/j5797ws8xt4bcb8s5jsv4bmtwx73fh1f/page.tsx
//import { Canvas } from "./_components/canvas"
import { Room } from "@/components/room"
import { Loading } from "@/components/auth/loading"
import { teardownHeapProfiler } from "next/dist/build/swc"
import Editor from "./_components/editor"
interface TextEditorPageProps {
    params: {
        roomId: string
    }
}

const TextEditorPage = ({
    params,
}: TextEditorPageProps) => {
    console.log(params.roomId)
    return (
        <div className="h-screen w-screen">
            <Room roomId="j5797ws8xt4bcb8s5jsv4bmtwx73fh1f" fallback={<Loading />}
            history={true}
            >
                <Editor />
            </Room>
            
        </div>
        
    )
}

export default TextEditorPage