import React from "react";
import { VideoWrapper } from "@/components/video/styles";
import { useAppState } from "@/state/app-state";

type Props = {
  src: string;
  loop: boolean;
  onEnded: () => void;
};

export default function Video({ src, loop, onEnded }: Props) {
  const { interacted } = useAppState();

  return (
    <VideoWrapper>
      <video
        src={src}
        muted={!interacted}
        autoPlay
        playsInline
        loop={loop}
        onEnded={onEnded}
      />
    </VideoWrapper>
  );
}
