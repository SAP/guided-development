import {initComponent, destroy} from '../Utils'
import Items from '../../src/components/Items.vue'
import _ from 'lodash'

let wrapper

describe('Items.vue', () => {

    afterEach(() => {
        destroy(wrapper)
    });

    test('component name', () => {
        wrapper = initComponent(Items, {items: [], filter: {}, bColorFlag: true}, true)
        expect(wrapper.name()).toBe('Items')
    })

    test('component props', () => {
        wrapper = initComponent(Items, {items: [], filter: {}, bColorFlag: true}, true)
        expect(_.keys(wrapper.props())).toHaveLength(3)
    })

    describe('onAction - method', () => {
        test('no items', async () => {
            wrapper = initComponent(Items, {items: [], filter: new Map(), bColorFlag: true}, true)
            const contextualItem = {
                item: {
                    fqid: "fqid"
                },
                context: "context"
                }
            wrapper.vm.onAction(contextualItem, 1);
            expect(wrapper.emitted().action).toBeTruthy();
        })

        test('item exists', async () => {
            let item = {
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
                    { "Project Type": "create-grocery-list" }
                ]
            };
            wrapper = initComponent(Items, {items: [item], filter: new Map(), bColorFlag: true}, true)
            let contextualItem = wrapper.vm.contextualItem;
            wrapper.vm.onAction(contextualItem, 1);
            expect(wrapper.emitted().action).toBeTruthy();
        })
    })

    describe('isFiltered - method', () => {
        test('no filter', async () => {
            let item = {
                id: "id1",
                fqid: "fqid",
                title: "title1",
                description: "description1",
                action1:  {
                    name: "name",
                    action: "action"
                },
                labels: [
                    { "Project Type": "create-grocery-list" }
                ]
            };
            wrapper = initComponent(Items, {items: [item], filter: new Map(), bColorFlag: true}, true)
        
            const res = wrapper.vm.isFiltered("itemId");
            expect(res).toBe(false);
        })

        test('filter exists', async () => {
            let item1 = {
                id: "id1",
                fqid: "fqid1",
                title: "title1",
                description: "description1",
                labels: [
                    { "ProjectType": "create1" }
                ]
            };
            let filter = new Map();
            filter.set("ProjectType", "create2")

            wrapper = initComponent(Items, {items: [item1], filter: filter, bColorFlag: true}, true)

            const res = wrapper.vm.isFiltered("fqid1");
            expect(res).toBe(false);
        })
    })
})
