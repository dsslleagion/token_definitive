
import React, { useState, useEffect, useContext } from 'react';
import { UsuariosComponente } from "../../components/Usuarios";
import { apiurl } from '../../Helpers/ApiUrl';
import { Text, View, Alert } from 'react-native';
import { GlobalContext } from '../../Context/GlobalProvider';



export const UpdateUsu = ({ route, navigation }: any) => {
    const context = useContext(GlobalContext);
    const token = context?.token || "";
    const { id } = route.params
    const [form, onChangeForm] = useState({
        nome: "",
        sobrenome: "",
        email: "",
        telefone1: "",
        telefone2: "",
        matricula: "",
        cpf: "",
        foto: [],
    })

    const [valida, setValida] = useState(false)
    const [validarEmailRegex, setVlidarEmailRegex] = useState(false)
    const [validarTexto, setValidarTexto] = useState(false)
    const [validaTelefoneCeleluar, setValidarTelefoneCelular] = useState(false)
    const [validaTelefoneFixo, setValidarTelefoneFixo] = useState(false)
    const [validaMatricula, setValidarMatricula] = useState(false)
    const [validaMatriculaRegex, setValidarMatriculaRegex] = useState(false)
    const [validaCpfRegex, setValidarCpfRegex] = useState(false)
    const [loading, setLoading] = useState(false)

    const onChangeText = (name: string, value: string) => {
        onChangeForm({ ...form, [name]: value });


    };
    function validarVazio(nome: string, sobrenome: string, email: string, telefone1: string, matricula: string, cpf: string) {
        if (!nome || !sobrenome || !email || !telefone1 || !matricula || !cpf ) {
            setValida(true)
            return true
        }
        setValida(false)
        return false
    }
    function validaTextoSemNmr(nome: string, sobrenome: string) {
        const textoRegex = /^[a-zA-Z]+$/;
        if (!textoRegex.test(nome) || !textoRegex.test(sobrenome)) {
            setValidarTexto(true)
            return true
        }
        setValidarTexto(false)
        return false
    }

    function validarTelefone(telefone: string) {
        const celularRegex = /\+\d{13}/;
        if (!celularRegex.test(telefone)) {
            setValidarTelefoneCelular(true)
            return true
        }
        setValidarTelefoneCelular(false)
        return false
    }
    function validarTelefoneFixo(telefone: string) {
        const regexTelefoneFixo = /^\d{10}$/;
        if (telefone) {
            if (!regexTelefoneFixo.test(telefone)) {
                setValidarTelefoneFixo(true)
                return true
            }
            setValidarTelefoneFixo(false)
            return false
        }
        setValidarTelefoneFixo(false)
        return false

    }
    function validarEmail(email: string) {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) {
            setVlidarEmailRegex(true)
            return true
        }
        setVlidarEmailRegex(false)
        return false
    }
    function validarMatricula(matricula: string) {
        if (matricula.length < 5) {
            setValidarMatricula(true)
            return true
        }
        setValidarMatricula(false)
        return false
    }
    function validarMatriculaRegex(matricula: string) {
        const matriculaRegex = /^\d{5,15}$/;
        if (!matriculaRegex.test(matricula)) {
            setValidarMatriculaRegex(true)
            return true
        }
        setValidarMatriculaRegex(false)
        return false
    }
    function validarCpfRegex(cpf: string) {
        const CPFRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
        if (!CPFRegex.test(cpf)) {
            setValidarCpfRegex(true)
            return true
        }
        setValidarCpfRegex(false)
        return false
    }


    function getUsuario() {
        const url = apiurl + '/user/list/' + id;
        fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                'Authorization': `Bearer ${token}`
            }
        })
            .then((resposta) => resposta.json())
            .then((data) => {
                if (data !== null) {
                    onChangeForm({
                        ...form,
                        nome: data.nome || "",
                        sobrenome: data.sobrenome || "",
                        email: data.email || "",
                        telefone1: data.telefone1 || "",
                        telefone2: data.telefone2 || "",
                        matricula: data.matricula || "",
                        cpf: data.cpf || "",
                        foto: data.foto || [],
                    });

                }
            })



    }


    useEffect(() => {
        getUsuario();
    }, []);



    function updateUsuario() {
        if (validarVazio(form.nome, form.sobrenome, form.email, form.telefone1, form.matricula, form.cpf)) {
            return
        }
        if (validaTextoSemNmr(form.nome, form.sobrenome)) {
            return
        }
        if (validarEmail(form.email)) {
            return
        }
        if (validarTelefone(form.telefone1)) {
            return
        }
        if (validarTelefoneFixo(form.telefone2)) {
            return
        }
        if (validarMatricula(form.matricula)) {
            return
        }
        if (validarMatriculaRegex(form.matricula)) {
            return
        }
        if (validarCpfRegex(form.cpf)) {
            return
        }

        const url = apiurl + "/user/update/" + id;
        setLoading(true)
        fetch(url, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(form)

        })
            .then((resposta) => resposta.json())
            .then((data) => {
                if (data.error) {
                    Alert.alert(
                        'Alterar usuário',
                        'Erro ao alterar usuário.',
                        [

                            {
                                text: 'OK', onPress: () => console.log(data.error)
                            },
                        ],
                        { cancelable: false }
                    );

                } else {
                    Alert.alert(
                        'Alterar usuário',
                        'Usuário alterado com sucesso.',
                        [

                            {
                                text: 'OK', onPress: () => ''
                            },
                        ],
                        { cancelable: false }
                    );
                    navigation.navigate("Usuários", { userAlterado: true });

                }
            }).finally(() => {
                setLoading(false)
            });
    }

    function deletarUsuario() {
        let url = apiurl + "/user/delete"
        setLoading(true)
        fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ id: id })
        }).then((resp) => resp.json()).then((data) => {

            if (data.error) {
                Alert.alert(
                    'Deletar usuário',
                    'Erro ao deletar usuário.',
                    [

                        {
                            text: 'OK', onPress: () => console.log(data.error)
                        },
                    ],
                    { cancelable: false }
                );

            } else {
                Alert.alert(
                    'Deletar usuário',
                    'Usuário deletado com sucesso.',
                    [

                        {
                            text: 'OK', onPress: () => ''
                        },
                    ],
                    { cancelable: false }
                );
                navigation.navigate("Usuários", { userDeletado: true });


            }

        }).finally(() => {
            setLoading(false)
        })
    }

    const showAlertUpdate = () => {
        Alert.alert(
          'Alterar usuário',
          'Deseja alterar este usuário?',
          [
            {
              text: 'NÃO',
              onPress: () => '',
              style: 'cancel',
            },
            { text: 'SIM', onPress: () => updateUsuario() },
          ],
          { cancelable: false }
        );
      };
      
    const showAlertDelete = () => {
        Alert.alert(
          'Deletar usuário',
          'Deseja deletar este usuário?',
          [
            {
              text: 'NÃO',
              onPress: () => '',
              style: 'cancel',
            },
            { text: 'SIM', onPress: () => deletarUsuario() },
          ],
          { cancelable: false }
        );
      };

    return (
        <>
            {valida ?
                <Text style={{ color: "red", paddingLeft: 12 }}>Campos com * são obrigatórios.</Text>
                : ""
            }
            
            {validarEmailRegex ?
                <View>
                    <Text style={{ color: "red", paddingLeft: 12 }}>O e-mail deve conter os seguintes itens:</Text>
                    <Text style={{ color: "red", paddingLeft: 12 }}>Pelo menos um caractere antes do '@'</Text>
                    <Text style={{ color: "red", paddingLeft: 12 }}>Pelo menos um caractere antes do ponto '.' no domínio</Text>
                    <Text style={{ color: "red", paddingLeft: 12 }}>O domínio deve conter pelo menos duas letras (por exemplo, 'com', 'org', 'net')</Text>
                    <Text style={{ color: "red", paddingLeft: 12 }}>Não deve conter espaços em branco</Text>
                </View>
                : ""
            }
            {validarTexto ?
                <Text style={{ color: "red", paddingLeft: 12 }}>Nome ou sobrenome deve conter apenas letras.</Text>
                : ""
            }
            {validaTelefoneCeleluar ?
                <Text style={{ color: "red", paddingLeft: 12 }}>O número do celular deve conter o DDI, DDD e ao menos 9 números.</Text>
                : ""
            }
            {validaTelefoneFixo ?
                <Text style={{ color: "red", paddingLeft: 12 }}>O telefone de recado deve ter 10 números.</Text>
                : ""
            }
            {validaMatricula ?
                <Text style={{ color: "red", paddingLeft: 12 }}>A matricula deve conter no minimo 5 números.</Text>
                : ""
            }
            {validaMatriculaRegex ?
                <Text style={{ color: "red", paddingLeft: 12 }}>A matricula deve conter apenas números.</Text>
                : ""
            }
            {validaCpfRegex ?
                <Text style={{ color: "red", paddingLeft: 12 }}>O CPF deve conter o padrão xxx.xxx.xxx-xx e não pode possuir letras.</Text>
                : ""
            }

            <UsuariosComponente
                form={form}
                onChangeText={onChangeText}
                onPress={loading ? null : showAlertUpdate}
                onpress2={loading ? null : showAlertDelete}
                title={'Alterar'}
                title2={'Deletar'}
                corTexto={'black'}
                color={'#4682B4'}
                color2={'#87CEFA'}
                color4={'#ff524a'}
                color3={'#ff4627'}
                corTexto2={'white'}

            />
        </>

    );
};

