import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    Platform,
    ListView,
    Keyboard,AsyncStorage
} from 'react-native';
import Header from './header';
import Footer from './footer';
import Row from './row';
const filterItems = (filter, items) => {
    return items.filter((item) => {
        if (filter === "ALL")
            return true;
        if (filter === "ACTIVE")
            return !item.complete;
        if (filter === "COMPLETED")
            return item.complete;
        }
    )
}
class App extends Component {
    constructor(props) {
        super(props);
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            value: '',
            filter: "ALL",
            items: [],
            allComplete: false,
            dataSource: ds.cloneWithRows([])
        }
        /* 不要忘了在constructor中bind method */
        this.handleAddItem = this.handleAddItem.bind(this);
        this.handleToggleAllComplete = this.handleToggleAllComplete.bind(this);
        this.handleToggleComplete = this.handleToggleComplete.bind(this);
        this.handleRemoveItem = this.handleRemoveItem.bind(this)
        this.handleFilter = this.handleFilter.bind(this)
    }
    componentWillMount() {
        AsyncStorage.getItem("items").then(json => {
            try {
                const items = JSON.parse(json);
                this.setSource(items, items);
            } catch (e) {}
        });
    }
    handleAddItem() {
        if (!this.state.value)
            return;
        const newItems = [
            ...this.state.items, {
                key: Date.now(),
                text: this.state.value,
                complete: false
            }
        ]
        this.setSource(newItems, newItems, { value: '' });
        console.log(this);;
    }
    handleToggleAllComplete() {
        const complete = !this.state.allComplete;
        const newItems = this.state.items.map((item) => ({
            ...item,
            complete
        }))

        this.setSource(newItems, filterItems(this.state.filter, newItems),{allComplete:complete})
    }
    setSource(items, itemsDatasource, otherState = {}) {
        this.setState({
            items,
            dataSource: this.state.dataSource.cloneWithRows(itemsDatasource),
            ...otherState
        })
        AsyncStorage.setItem("items", JSON.stringify(items));
    }
    handleToggleComplete(key, complete) {
        const newItems = this.state.items.map((item) => {
            if (item.key !== key){
                return item;
            }else{
                return {
                    ...item,
                    complete
                }
            }


        })
        this.setSource(newItems,  filterItems(this.state.filter, newItems));
    }
    handleRemoveItem(key){
        const newItems = this.state.items.filter((item)=>{
            return item.key !== key
        })
        this.setSource(newItems,  filterItems(this.state.filter, newItems));
    }
    handleFilter(filter) {
        this.setSource(this.state.items, filterItems(filter, this.state.items), { filter })
     }
    render() {
        return (
            <View style={styles.container}>
                <Header value={this.state.value} onAddItem={this.handleAddItem} onChange={(value) => this.setState({value})} onToggleAllComplete={this.handleToggleAllComplete}/>
                <View style={styles.content}>
                    <ListView
                    style={styles.list}
                    enableEmptySections
                    dataSource={this.state.dataSource}
                    onScroll={() => Keyboard.dismiss()}
                    renderRow={({key, ...value}) => {
                      return (
                        <Row
                          key={key}
                          onRemove = {() => this.handleRemoveItem(key)}
                          onComplete = {(complete) => this.handleToggleComplete(key, complete)}
                          {...value}
                        />
                      )
                    }}
                    renderSeparator={(sectionId, rowId) => {
                      return <View key={rowId} style={styles.separator}/>
                    }}
                    />
                    </View>
                    <Footer onFilter={this.handleFilter}  count={filterItems("ACTIVE", this.state.items).length} filter={this.state.filter} />
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F5F5F5",
        ...Platform.select({
            ios: {
                paddingTop: 30
            }
        })
    },
    content: {
        flex: 1
    },
    list: {
        backgroundColor: '#FFF'
    },
    separator: {
        borderWidth: 1,
        borderColor: "#F5F5F5"
    }
})
export default App;
