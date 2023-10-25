import React, { useContext, useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View, TextInput, Alert} from "react-native";
import Card from "../../components/Common/Card";
import { CustomButton } from "../../components/Common/Button";
import { apiurl } from "../../Helpers/ApiUrl";
import { GlobalContext } from "../../Context/GlobalProvider";
interface Props {
    serial: string,
    latitude: string,
    longitude: string,
    observacoes: string,
    foto: any,
    status: number,
    tipo: string,
    modelo: string,
    id: string
}

export const Home = ({ route, navigation }: any) => {
    const context = useContext(GlobalContext);
    const token = context?.token || "";
    const [equipamento, setEquipamento] = React.useState<Props[]>([]);
    const [searchText, setSearchText] = useState<string>('');
    const { equipAlterada, equipCadastrada } = route.params || {};

    function getEquipamentos() {

        const url = apiurl + "/equipment/list";
        fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                'Authorization': `Bearer ${token}`
            }
        })

        .then((resposta) => {
            if (!resposta.ok) {
                throw new Error('Erro na solicitação à API');
            }
            return resposta.json();
        })
        .then((data) => {
            setEquipamento(data)
        })
        .catch((error) => {
            console.error(error);

        });
    }
 
    useEffect(() => {
        getEquipamentos();
        if (equipAlterada || equipCadastrada) {
            getEquipamentos();
        }
    }, [equipAlterada, equipCadastrada]);

    // const handleCardPress = (id: string) => {
    //     navigation.navigate("Atualizar Equipamento", { id });
    // };

    const showAlert = (id: string) => {
        Alert.alert(
          'Ações',
          'O que deseja fazer?',
          [
            {
              text: 'Editar',
              onPress: () =>   navigation.navigate("Atualizar Equipamento", { id }),
              style: 'cancel',
            },
            { text: 'Visualizar', onPress: () => navigation.navigate("Detalhes Equipamento", { id }) },
          ],
          { cancelable: false }
        );
      };
    const filteredEquipamento = equipamento.filter((equipamento) => {
        return equipamento.tipo.toLowerCase().includes(searchText.toLowerCase());
    });
    return (
        <>
            <TextInput
                style={styles.searchInput}
                placeholder="Pesquisar equipamentos"
                placeholderTextColor="black"
                value={searchText}
                onChangeText={(text) => setSearchText(text)}
            />
            <ScrollView>
                <View style={styles.container}>
                    {filteredEquipamento.map(e =>
                        <Card
                            key={e.id}
                            title={e.tipo}
                            nserie={e.serial}
                            id={e.id}
                            image={e.foto}
                            ativo={e.status}
                            onCardPress={showAlert}>
                        </Card>
                    )}
                </View>
                <View style={styles.algumacoisa}>
                    <View style={styles.centeredView}>
                        <CustomButton title={"Cadastrar"} corTexto={'black'} onPress={() => navigation.navigate("Cadastro de Equipamento")} color={'#9ACD32'} color2={'#94C021'} />
                    </View>
                </View>
            </ScrollView>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: "flex-start",
        justifyContent: 'center'
    },
    searchInput: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        margin: 10,
        color:'black',
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
    },
    algumacoisa: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    centeredView: {
        width: 500,
        justifyContent: 'center',
        alignItems: 'center',
    },
})
