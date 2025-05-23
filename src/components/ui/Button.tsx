import { Text, TouchableOpacity } from "react-native";

function SetUpButton({
  title,
  handlePress,
  disabled,
  ...props
}: {
  title: string;
  handlePress: () => void;
  disabled?: boolean;
}) {
  return (
    <TouchableOpacity
      className={`w-full items-center justify-center rounded-2xl px-6 py-4 md:py-6 ${
        disabled ? "bg-gray-200" : "bg-blue-200"
      } text-gray-400`}
      onPress={handlePress}
      disabled={disabled}
      {...props}
    >
      <Text
        className={`text-base font-medium md:text-2xl ${
          disabled ? "text-gray-800" : "text-blue-800"
        }`}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}

export { SetUpButton };
