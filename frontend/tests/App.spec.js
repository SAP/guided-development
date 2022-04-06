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

  it('changeItemsState - method', () => {
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
    wrapper.vm.changeItemsState([{fqid:fqid1, readState: "READ"}]);
    const tarItem = wrapper.vm.getItemByFqid(fqid1);
    expect(tarItem.readState).toEqual("READ");
  })

  it('getItemByFqid - method', () => {
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
        title: "title1",
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
