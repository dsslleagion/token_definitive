import React from "react";
import { StyleSheet, TextInput } from "react-native";

interface InputProps {
    placeholder: string;
    onChangeText: (text: string) => void;
    value: string;
    password?: boolean
}

export const Input: React.FC<InputProps> = ({ placeholder, onChangeText, value, password = false }) => {
    return (
        <TextInput
            style={styles.input}
            onChangeText={onChangeText}
            value={value}
            placeholder={placeholder}
            placeholderTextColor='gray'
            secureTextEntry={password}
        />
    );
}


const styles = StyleSheet.create({
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
        color: 'black',
        borderColor: '#A9A9A9',
        borderRadius: 5
    }
});
