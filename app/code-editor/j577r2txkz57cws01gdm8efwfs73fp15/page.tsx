import { Room } from "@/components/room";
import { CollaborativeEditor } from "@/app/code-editor/j577r2txkz57cws01gdm8efwfs73fp15/_components/CollaborativeEditor";
import Loading from "@/app/text-editor/j5797ws8xt4bcb8s5jsv4bmtwx73fh1f/loading";
export default function Home() {
  return (
    <main>
      <Room roomId="j577r2txkz57cws01gdm8efwfs73fp15" fallback = {<Loading />}>
        <CollaborativeEditor />
      </Room>
    </main>
  );
}
