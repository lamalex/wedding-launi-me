import { UploadButton } from "./UploadThing";

function allowedContent() {
  return (
    <div className="text-center text-lg inline-block">
      <span>Upload as many as you'd like!</span>
      <br />
      <span>We want all of them! (Up to 2GB at a time)</span>
    </div>
  );
}

export function ImageUploader() {
  return (
    <UploadButton
      className="ut-button:bg-pink-200 ut-button:ut-readying:bg-pink-200/50 ut-button:ut-uploading:bg-pink-200 pt-52"
      endpoint="imageUploader"
      onClientUploadComplete={() => {
        const messageEl = document.getElementById("message");
        if (!messageEl) {
          console.error("message element is missing");
          return;
        }

        messageEl.classList.remove("hidden");
      }}
      onUploadError={(error: Error) => {
        console.error(`uh oh ${error}`);
      }}
      content={{
        allowedContent: allowedContent(),
      }}
    />
  );
}
