/**
 * Video Player Component
 */
import React from "react";
import "@vidstack/react/player/styles/default/theme.css";
import "@vidstack/react/player/styles/default/layouts/video.css";
import { MediaPlayer, MediaProvider } from "@vidstack/react";
import { defaultLayoutIcons, DefaultVideoLayout } from "@vidstack/react/player/layouts/default";

interface Props {
  urlOfVideo: string;
  titleOfVideo: string;
}

const VideoPlayer: React.FC<Props> = ({ urlOfVideo, titleOfVideo }) => {
  return (
    <>
      <MediaPlayer dir="ltr" className="!w-[700px] !block !mx-auto !max-w-full" title={titleOfVideo} src={urlOfVideo}>
        <MediaProvider />
        <DefaultVideoLayout icons={defaultLayoutIcons} />
      </MediaPlayer>
    </>
  );
};

export default VideoPlayer;
