import React from "react";
import { VideoWrapper } from "@/components/video/styles";

type Props = {
  src: string;
  onEnded: () => void;
};

export default function Video({ src, onEnded }: Props) {
  return (
    <VideoWrapper>
      <video src={src} muted autoPlay playsInline loop onEnded={onEnded} />
    </VideoWrapper>
  );
}
