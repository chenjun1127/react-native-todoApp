import React, {Component} from "react";

import {View, Text, StyleSheet, Switch, TouchableOpacity} from "react-native";

class Row extends Component {

    render() {
        const {complete} = this.props;
        return (
            <View style={styles.container}>
                <Switch value={complete} onValueChange={this.props.onComplete}/>
                <View style={styles.textWrap}>
                    <Text style={[
                        styles.text, complete && styles.complete
                    ]}>{this.props.text}</Text>
                </View>
                <TouchableOpacity onPress={this.props.onRemove}>
                    <Text style={styles.remove}>×</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        padding: 10,
        flexDirection: "row",
        flex: 1,
        justifyContent: "space-between",
        alignItems: "flex-start"
    },
    textWrap: {
        flex: 1,
        marginHorizontal: 10
    },
    complete: {
        textDecorationLine: "line-through"
    },
    text: {
        fontSize: 24,
        color: "#4d4d4d"
    },
    remove: {
        fontSize: 20,
        color: "red"
    },

});

export default Row;
