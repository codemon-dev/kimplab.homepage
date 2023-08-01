import { message } from "antd"
import { ArgsProps } from "antd/es/message"


// export interface ArgsProps {
//   content: React.ReactNode;
//   duration?: number;
//   type?: NoticeType;
//   onClose?: () => void;
//   icon?: React.ReactNode;
//   key?: string | number;
//   style?: React.CSSProperties;
//   className?: string;
//   onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
// }


const DEFAULT_MESSAGE_DURATION = 3

function useMessage() {

  const showMessage = (arg: ArgsProps) => {
    console.log("showMessage: ", arg)
    if (!arg.duration) arg.duration = DEFAULT_MESSAGE_DURATION
    message.open(arg);
  }

  return [showMessage]
}

export default useMessage