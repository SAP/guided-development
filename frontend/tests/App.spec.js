import {initComponent, destroy} from './Utils'
import App from '../src/App.vue';
import Vue from 'vue'
import Vuetify from 'vuetify'
import { WebSocket } from 'mock-socket'

Vue.use(Vuetify);
global.WebSocket = WebSocket;

let wrapper;

describe('App.vue', () => {
  afterEach(() => {
    destroy(wrapper)
  })

  it('component name', () => {
    wrapper = initComponent(App, {}, true)
    expect(wrapper.name()).toBe('App')
  })

  it('initRpc - method', () => {
    wrapper = initComponent(App, {}, true)
    wrapper.vm.rpc = {
      invoke: jest.fn().mockImplementation(async () => { return { data: {} }; }),
      registerMethod: jest.fn()
    }
    
    wrapper.vm.showCollections = jest.fn()

    const invokeSpy = jest.spyOn(wrapper.vm.rpc, 'invoke')
    const registerMethodSpy = jest.spyOn(wrapper.vm.rpc, 'registerMethod')
    wrapper.vm.initRpc();
    
    expect(registerMethodSpy).toHaveBeenCalledWith({func: wrapper.vm.showCollections, thisArg: wrapper.vm, name: 'showCollections'})
    expect(registerMethodSpy).toHaveBeenCalledWith({func: wrapper.vm.changeItemsState, thisArg: wrapper.vm, name: 'changeItemsState'})
    expect(invokeSpy).toHaveBeenCalledWith("getState")

    invokeSpy.mockRestore()
    registerMethodSpy.mockRestore()
  })

  it('reload - method', () => {
    wrapper = initComponent(App)

    wrapper.vm.rpc = {
      invoke: jest.fn().mockImplementation(async () => { return { data: {} }; })
    }
    const invokeSpy = jest.spyOn(wrapper.vm.rpc, 'invoke')
    wrapper.vm.reload();
    
    expect(invokeSpy).toHaveBeenCalledWith("getState")

    invokeSpy.mockRestore()
  })

  it('showCollections - method', () => {
    wrapper = initComponent(App)
    wrapper.vm.showCollections("collection");
    expect(wrapper.vm.collections).toEqual("collection");
  })

  it("change not exist item's state", () => {
    wrapper = initComponent(App);
    const fqid1 = "extName1.extPublisher1.id1";
    const item1 = {
        id: "id1",
        fqid: fqid1,
        description: "description1",
        title: "title1",
        readState: "UNREAD",
        labels: []
    };
    const fqid2 = "extName1.extPublisher1.id2";
    const item2 = {
        id: "id2",
        fqid: fqid2,
        description: "description2",
        title: "title2",
        labels: [],
        items: [item1]
    };
    const collection1 = {
        id: "id1",
        title: "colTitle1",
        description: "description1",
        itemIds: [],
        type: 0,
        items: [item2]
    };
    const notExistsItemFqid = "extName1.extPublisher1.null";
    wrapper = initComponent(App);
    wrapper.vm.showCollections([collection1]);
    const ret = wrapper.vm.changeItemsState([{fqid:notExistsItemFqid, readState: "READ"}]);
    expect(ret).toBeFalsy();
  })

  it("change exist item's state", () => {
    wrapper = initComponent(App);
    const fqid1 = "extName1.extPublisher1.id1";
    const item1 = {
        id: "id1",
        fqid: fqid1,
        description: "description1",
        title: "title1",
        readState: "UNREAD",
        labels: []
    };
    const fqid2 = "extName1.extPublisher1.id2";
    const item2 = {
        id: "id2",
        fqid: fqid2,
        description: "description2",
        title: "title2",
        labels: [],
        items: [item1]
    };
    const collection1 = {
        id: "id1",
        title: "title1",
        description: "description1",
        itemIds: [],
        type: 0,
        items: [item2]
    };
    wrapper = initComponent(App);
    wrapper.vm.showCollections([collection1]);
    const tarItem = wrapper.vm.getItemByFqid(fqid1);
    expect(tarItem.readState).toEqual("UNREAD");
    wrapper.vm.changeItemsState([{fqid:fqid1, readState: "READ"}]);
    expect(tarItem.readState).toEqual("READ");
  }) 

  it('find an item not exists', () => {
    const fqid1 = "extName1.extPublisher1.id1";
    const item1 = {
        id: "id1",
        fqid: fqid1,
        description: "description1",
        title: "title1",
        labels: []
    };
    const collection1 = {
        id: "id1",
        title: "title1",
        description: "description1",
        itemIds: [],
        type: 0,
        items: [item1]
    };
    wrapper = initComponent(App);
    wrapper.vm.showCollections([collection1]);
    const notExistsItemFqid = "extName1.extPublisher1.null";
    const tarItem = wrapper.vm.getItemByFqid(notExistsItemFqid);
    expect(tarItem).toBeFalsy();
  })

  it('find an item at root level', () => {
    const fqid1 = "extName1.extPublisher1.id1";
    const item1 = {
        id: "id1",
        fqid: fqid1,
        description: "description1",
        title: "title1",
        labels: []
    };
    const collection1 = {
        id: "id1",
        title: "colTitle1",
        description: "description1",
        itemIds: [],
        type: 0,
        items: [item1]
    };
    wrapper = initComponent(App);
    wrapper.vm.showCollections([collection1]);
    const tarItem = wrapper.vm.getItemByFqid(fqid1);
    expect(tarItem.title).toEqual("title1")
  })

  it('find an item at second level', () => {
    const fqid1 = "extName1.extPublisher1.id1";
    const item1 = {
        id: "id1",
        fqid: fqid1,
        description: "description1",
        title: "title1",
        labels: []
    };
    const fqid2 = "extName1.extPublisher1.id2";
    const item2 = {
        id: "id2",
        fqid: fqid2,
        description: "description2",
        title: "title2",
        labels: [],
        items: [item1]
    };
    const collection1 = {
        id: "id1",
        title: "colTitle1",
        description: "description1",
        itemIds: [],
        type: 0,
        items: [item2]
    };
    wrapper = initComponent(App);
    wrapper.vm.showCollections([collection1]);
    const tarItem = wrapper.vm.getItemByFqid(fqid1);
    expect(tarItem.title).toEqual("title1")
  })
  
  it('find an item at third level', () => {
    const fqid1 = "extName1.extPublisher1.id1";
    const item1 = {
        id: "id1",
        fqid: fqid1,
        description: "description1",
        title: "title1",
        labels: []
    };
    const fqid2 = "extName1.extPublisher1.id2";
    const item2 = {
        id: "id2",
        fqid: fqid2,
        description: "description2",
        title: "title2",
        labels: [],
        items: [item1]
    };
    const fqid3 = "extName1.extPublisher1.id3";
    const item3 = {
        id: "id3",
        fqid: fqid3,
        description: "description3",
        title: "title3",
        labels: [],
        items: [item2]
    };
    const collection1 = {
        id: "id1",
        title: "colTitle1",
        description: "description1",
        itemIds: [],
        type: 0,
        items: [item3]
    };
    wrapper = initComponent(App);
    wrapper.vm.showCollections([collection1]);
    const tarItem = wrapper.vm.getItemByFqid(fqid1);
    expect(tarItem.title).toEqual("title1")
  })

  it('find an item of multiple collections', () => {
    const fqid1 = "extName1.extPublisher1.id1";
    const item1 = {
        id: "id1",
        fqid: fqid1,
        description: "description1",
        title: "title1",
        labels: []
    };
    const fqid2 = "extName1.extPublisher1.id2";
    const item2 = {
        id: "id2",
        fqid: fqid2,
        description: "description2",
        title: "title2",
        labels: [],
        items: []
    };
    
    const fqid3 = "extName1.extPublisher1.id3";
    const item3 = {
        id: "id3",
        fqid: fqid3,
        description: "description3",
        title: "title3",
        labels: [],
        items: [item2]
    };
    const collection1 = {
        id: "id1",
        title: "title1",
        description: "description1",
        itemIds: [],
        type: 0,
        items: [item1]
    };
    const collection2 = {
        id: "colId2",
        title: "colTitle2",
        description: "colDescription2",
        itemIds: [],
        type: 0,
        items: [item3]
    };
    wrapper = initComponent(App);
    wrapper.vm.showCollections([collection1, collection2]);
    const tarItem = wrapper.vm.getItemByFqid(fqid2);
    expect(tarItem.title).toEqual("title2")
  })
  
  
  it('onAction - method', () => {
    wrapper = initComponent(App, {}, true)
    wrapper.vm.rpc = {
      invoke: jest.fn().mockImplementation(async () => { return { data: {} }; })
    }
    const contextualItem = {
      item: {
        fqid: "fqid"
      },
      context: "context"
    }
    const invokeSpy = jest.spyOn(wrapper.vm.rpc, 'invoke')
    wrapper.vm.onAction(contextualItem, 1);
    
    expect(invokeSpy).toHaveBeenCalledWith("performAction", ["fqid", 1, "context"])

    invokeSpy.mockRestore()
  })

})
