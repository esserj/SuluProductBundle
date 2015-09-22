define(["config","suluproduct/util/product-delete-dialog"],function(a,b){"use strict";var c={instanceName:"documents",formSelector:"#documents-form",fieldsKey:"media",fieldsUrl:"api/products/media/fields"};return{view:!0,templates:["/admin/product/template/product/documents"],initialize:function(){this.newSelectionItems=[],this.newSelections=[],this.removedSelections=[],this.currentSelection=this.sandbox.util.arrayGetColumn(this.options.data.attributes.media,"id"),this.status=this.options.data?this.options.data.attributes.status:a.get("product.status.active"),this.statusChanged=!1,this.sandbox.emit("product.state.change",this.status),this.setHeaderBar(!0),this.render(),this.bindCustomEvents()},render:function(){this.html(this.renderTemplate(this.templates[0])),this.startSelectionOverlay(),this.initList()},bindCustomEvents:function(){this.sandbox.on("sulu.toolbar.delete",function(){this.sandbox.emit("sulu.product.delete",this.options.id)}.bind(this)),this.sandbox.on("product.state.change",function(a){this.options.data.attributes.status&&this.options.data.attributes.status.id===a.id||(this.status=a,this.statusChanged=!0,this.setHeaderBar(!1))},this),this.sandbox.on("sulu.toolbar.save",this.submit.bind(this)),this.sandbox.on("sulu.header.back",function(){this.sandbox.emit("sulu.products.list")},this),this.sandbox.on("sulu.products.saved",this.savedProduct.bind(this)),this.sandbox.on("husky.datagrid."+c.instanceName+".number.selections",function(a){var b=a>0?"enable":"disable";this.sandbox.emit("husky.toolbar.documents.item."+b,"deleteSelected",!1)},this),this.sandbox.on("sulu.products.media.removed",this.removeItemsFromList.bind(this)),this.sandbox.on("sulu.products.media.saved",this.addItemsToList.bind(this)),this.sandbox.on("sulu.media-selection-overlay."+c.instanceName+".record-selected",this.selectItem.bind(this)),this.sandbox.on("sulu.media-selection-overlay."+c.instanceName+".record-deselected",this.deselectItem.bind(this)),this.sandbox.on("husky.overlay."+c.instanceName+".close",this.submit.bind(this))},removeItemsFromList:function(){var a=this.removedSelections.slice();a.forEach(function(a){this.sandbox.emit("husky.datagrid."+c.instanceName+".record.remove",a)}.bind(this)),this.setHeaderBar(!0),this.removedSelections=[]},addItemsToList:function(){this.newSelectionItems.forEach(function(a){this.sandbox.emit("husky.datagrid."+c.instanceName+".record.add",a)}.bind(this)),this.setHeaderBar(!0),this.newSelectionItems=[],this.newSelections=[]},savedProduct:function(){this.options.data.status=this.status,this.setHeaderBar(!0)},deselectItem:function(a){if(this.currentSelection.indexOf(a)>-1&&-1===this.removedSelections.indexOf(a)&&this.removedSelections.push(a),this.newSelections.indexOf(a)>-1){var b=this.newSelections.indexOf(a);this.newSelections.splice(b,1),this.newSelectionItems.splice(b,1)}},selectItem:function(a,b){this.currentSelection.indexOf(a)<0&&this.newSelections.indexOf(a)<0&&(this.newSelections.push(a),this.newSelectionItems.push(b)),this.removedSelections.indexOf(a)>-1&&this.removedSelections.splice(this.removedSelections.indexOf(a),1)},submit:function(){(this.newSelections.length>0||this.removedSelections.length>0||this.statusChanged)&&(this.sandbox.emit("sulu.products.media.save",this.options.data.id,this.newSelections,this.removedSelections),this.options.data.attributes.status=this.status,this.saved=!1,this.sandbox.emit("sulu.products.save",this.options.data.attributes))},setHeaderBar:function(a){a!==this.saved&&(a?this.sandbox.emit("sulu.header.toolbar.item.disable","save",!0):this.sandbox.emit("sulu.header.toolbar.item.enable","save",!1)),this.saved=a},showAddOverlay:function(){this.sandbox.emit("sulu.media-selection-overlay.documents.set-selected",this.currentSelection),this.sandbox.emit("sulu.media-selection-overlay.documents.open")},removeSelected:function(){this.sandbox.emit("husky.datagrid.documents.items.get-selected",function(a){b.showMediaRemoveDialog(this.sandbox,function(b){b&&(this.currentSelection=this.sandbox.util.removeFromArray(this.currentSelection,a),this.removedSelections=a,this.submit())}.bind(this))}.bind(this))},initList:function(){this.sandbox.sulu.initListToolbarAndList.call(this,c.fieldsKey,c.fieldsUrl,{el:this.$find("#list-toolbar-container"),instanceName:c.instanceName,template:this.getListTemplate(),hasSearch:!0},{el:this.$find("#documents-list"),url:this.getListUrl(),searchInstanceName:c.instanceName,instanceName:c.instanceName,resultKey:"media",searchFields:["name","title","description"],viewOptions:{table:{selectItem:{type:"checkbox"}}}})},getListUrl:function(){return"api/products/"+this.options.data.id+"/media?flat=true"},getListTemplate:function(){return this.sandbox.sulu.buttons.get({add:{options:{callback:this.showAddOverlay.bind(this)}},deleteSelected:{options:{callback:this.removeSelected.bind(this)}}})},startSelectionOverlay:function(){var a=this.sandbox.dom.createElement("<div/>");this.sandbox.dom.append(this.$el,a),this.sandbox.start([{name:"media-selection-overlay@sulumedia",options:{el:a,instanceName:c.instanceName,preselectedIds:this.currentSelection}}])}}});