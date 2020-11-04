import {initComponent, destroy} from '../Utils'
import Collections from '../../src/components/Collections.vue'
import _ from 'lodash'

let wrapper

describe('ICollection.vue', () => {

    afterEach(() => {
        destroy(wrapper)
    });

    test('component name', () => {
        wrapper = initComponent(Collections, {collections: []}, true)
        expect(wrapper.name()).toBe('Collections')
    })

    test('component props', () => {
        wrapper = initComponent(Collections, {collections: []}, true)
        expect(_.keys(wrapper.props())).toHaveLength(1)
    })

    test('onAction - method', async () => {
        wrapper = initComponent(Collections, {collections: []}, true)
        const contextualItem = {
            item: {
                fqid: "fqid"
            },
            context: "context"
            }
        wrapper.vm.onAction(contextualItem, 1);
        expect(wrapper.emitted().action).toBeTruthy();
    })

    test('onFilter - method', async () => {
        wrapper = initComponent(Collections, {collections: []}, true)
        const json = "{ \"type\": \"foodq\" }"
        let filter = new Map();
        const labelObj = JSON.parse(json);
        filter.set(labelObj.key, labelObj.value);

        wrapper.vm.onFilter(json);
        expect(wrapper.vm.filter).toEqual(filter)
    })

    test('normalizeLabels - method', async () => {
        let item1 = {
            id: "id1",
            fqid: "fqid",
            title: "title1",
            description: "description1",
            action1:  {
                name: "name",
                action: "action",
                contexts: [{
                    project: "myProj",
                    context: {}
                }]
            },
            labels: [
                { "key": "value" }
            ]
        };
        let collection1 = {
            id: "collection1",
            title: "title1",
            description: "description1",
            items: [item1]
        };
        let labels = new Map();
        let label = new Map();
        label.set("__all", {text:"<All>", value:JSON.stringify({"key":"key",value:"__all"})});
        label.set("value", {text:"value", value:JSON.stringify({"key":"key",value:"value"})});
        labels.set("key", label);

        wrapper = initComponent(Collections, {collections: [collection1]}, true)
        wrapper.vm.normalizeLabels();
        expect(wrapper.vm.labels).toEqual(labels)
    })
    
    
})