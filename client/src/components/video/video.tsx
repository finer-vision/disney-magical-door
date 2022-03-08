import React from "react";
import { VideoWrapper } from "@/components/video/styles";

type Props = {
  src: string;
  loop: boolean;
  onEnded: () => void;
};

export default function Video({ src, loop, onEnded }: Props) {
  return (
    <VideoWrapper>
      <video
        src={src}
        muted
        autoPlay
        playsInline
        loop={loop}
        onEnded={onEnded}
      />
    </VideoWrapper>
  );
}
