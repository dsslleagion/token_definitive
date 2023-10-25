import React, { useState, useContext } from "react";
import { View, StyleSheet, Text } from "react-native";
import { CustomButton } from "../../Common/Button";
import { Input } from "../../Common/Input/Input";
import { apiurl } from "../../../Helpers/ApiUrl";
import { GlobalContext } from "../../../Context/GlobalProvider";

export const AtualizarSenha = ({ route, navigation }: any) => {
    const [senha, setSenha] = useState('');
    const [senhaconfirma, setSenhaConfirma] = useState('');
    const [error, setError] = useState<null | string>(null);
    const { isEmail, value } = route.params;
    const context = useContext(GlobalContext);
    const token = context?.token || "";

    function atualizar() {
        if (senha != senhaconfirma) {
            setError("As senhas não condizem.")
            return
        }
        var vForm = isEmail ? { senha: senha, email: value } : { senha: senha, telefone1: value }
        fetch(apiurl + "/user/atualizarSenha", {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(vForm)
        })
            .then((resposta) => resposta.json())
            .then((data) => {
                if(data.error){
                    setError(data.error)
                    
                }else{
                    setError(null)
                    navigation.navigate("Login")
                }

            })
    }

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.text}>Atualize sua senha</Text>
                <View style={styles.inputContainer}>
                    <Input onChangeText={setSenha} value={senha} placeholder="Insira sua senha"  password={true} />
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Confirme sua senha</Text>
                    <Input onChangeText={setSenhaConfirma} value={senhaconfirma} placeholder="Confirme sua senha"  password={true} />
                </View>
                {error?
                    <View style={styles.errorMessageContainer} >
                        <Text style={styles.errorMessage}>{error}</Text>
                    </View>:null
                    }
                <View style={styles.buttonContainer}>
                    <CustomButton
                        color='#5f781f'
                        color2="#94C021"
                        corTexto="white"
                        title="Atualizar"
                        onPress={atualizar}
                    />
                </View>
            </View>
           
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white'
    },
    content: {
        alignItems: 'center',
    },
    text: {
        color: '#94C021',
        fontSize: 20,
        marginRight: 15,
        marginTop: -160
    },
    inputContainer: {
        alignSelf: 'stretch',
        marginBottom: 20,
    },
    label: {
        color: '#94C021',
        fontSize: 20,
        marginLeft: 15,
    },
    buttonContainer: {
        alignSelf: 'stretch',
        marginHorizontal: 20,
        height: 50
    },
    errorMessageContainer: {
        borderColor:'#94C021',
        borderStyle:'solid',
        display:'flex',
        alignItems:"center",
        padding:5
    },
    errorMessage: {
      color:"red"
    }
});
