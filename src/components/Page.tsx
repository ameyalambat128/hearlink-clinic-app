import { View, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type ViewProps = View["props"] & {
  children: React.ReactNode;
  className?: string;
  headerShown?: boolean;
};

const Page: React.FC<ViewProps> = ({
  children,
  style,
  className,
  headerShown = true,
  ...otherProps
}) => {
  const { top } = useSafeAreaInsets();
  return (
    <View
      style={[
        !headerShown && {
          paddingTop: top,
        },
        style,
      ]}
      className={className}
      {...otherProps}
    >
      {children}
    </View>
  );
};

export default Page;
