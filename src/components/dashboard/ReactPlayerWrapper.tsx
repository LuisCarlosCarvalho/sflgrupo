"use client";

import ReactPlayer, { ReactPlayerProps } from "react-player";

export default function ReactPlayerWrapper(props: ReactPlayerProps) {
  return <ReactPlayer {...props} />;
}
