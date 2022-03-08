import React from "react";
import { VideoWrapper } from "@/components/video/styles";

type Props = {
  src: string;
};

export default function Video({ src }: Props) {
  return (
    <VideoWrapper>
      <video src={src} muted autoPlay playsInline loop />
    </VideoWrapper>
  );
}
