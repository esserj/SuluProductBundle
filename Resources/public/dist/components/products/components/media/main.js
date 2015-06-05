define(["config"],function(a){"use strict";var b={maxLengthTitle:60,formSelector:"#documents-form"},c=function(){var a="pim.product.title",c=[{title:"navigation.pim"},{title:"pim.products.title"}];return this.options.data&&this.options.data.attributes.name&&(a=this.options.data.attributes.name),a=this.sandbox.util.cropTail(a,b.maxLengthTitle),this.options.data&&this.options.data.attributes.number?c.push({title:"#"+this.options.data.attributes.number}):c.push({title:"pim.product.title"}),this.sandbox.emit("sulu.header.set-title",a),this.sandbox.emit("sulu.header.set-breadcrumb",c),{toolbar:{template:"default",languageChanger:{preSelected:this.options.locale}},tabs:!1}};return{view:!0,templates:["/admin/product/template/product/documents"],initialize:function(){this.newSelections=[],this.removedSelections=[],this.currentSelection=this.getPropertyFromArrayOfObject(this.options.data.attributes.media,"id"),this.status=this.options.data?this.options.data.attributes.status:a.get("product.status.active"),this.statusChanged=!1,c.call(this),this.setHeaderBar(!0),this.render()},getPropertyFromArrayOfObject:function(a,b){if("array"===this.sandbox.util.typeOf(a)&&a.length>0&&"object"===this.sandbox.util.typeOf(a[0])){var c=[];return this.sandbox.util.foreach(a,function(a){c.push(a[b])}.bind(this)),c}return a},render:function(){this.html(this.renderTemplate(this.templates[0])),this.initForm(this.options.data),this.bindCustomEvents()},initForm:function(a){var c=this.sandbox.form.create(b.formSelector);c.initialized.then(function(){this.setForm(a.toJSON())}.bind(this))},setForm:function(a){this.sandbox.form.setData(b.formSelector,a).fail(function(a){this.sandbox.logger.error("An error occured when setting data!",a)}.bind(this))},bindCustomEvents:function(){this.sandbox.on("sulu.header.toolbar.delete",function(){this.sandbox.emit("sulu.product.delete",this.options.id)}.bind(this)),this.sandbox.on("product.state.change",function(a){this.options.data.attributes.status&&this.options.data.attributes.status.id===a||(this.status={id:a},this.statusChanged=!0,this.setHeaderBar(!1))},this),this.sandbox.on("sulu.header.toolbar.save",function(){this.submit()},this),this.sandbox.on("sulu.header.back",function(){this.sandbox.emit("sulu.products.list")},this),this.sandbox.on("sulu.media-selection.document-selection.data-changed",function(){this.setHeaderBar(!1)},this),this.sandbox.on("sulu.products.media.removed",this.resetAndRemoveFromCurrent.bind(this)),this.sandbox.on("sulu.products.media.saved",this.resetAndAddToCurrent.bind(this)),this.sandbox.on("sulu.media-selection.document-selection.record-selected",this.selectItem.bind(this)),this.sandbox.on("husky.dropzone.media-selection-document-selection.files-added",this.addedItems.bind(this)),this.sandbox.on("sulu.media-selection.document-selection.record-deselected",this.deselectItem.bind(this)),this.sandbox.on("sulu.products.saved",this.savedProduct.bind(this))},savedProduct:function(){this.options.data.status=this.status,this.setHeaderBar(!0)},resetAndRemoveFromCurrent:function(a){this.setHeaderBar(!0),this.newSelections=[],this.removedSelections=[],this.sandbox.util.foreach(a,function(a){this.currentSelection.indexOf(a)>-1&&this.currentSelection.splice(this.currentSelection.indexOf(a),1)}.bind(this)),this.setForm(this.currentSelection)},resetAndAddToCurrent:function(a){this.setHeaderBar(!0),this.newSelections=[],this.removedSelections=[],this.currentSelection=this.currentSelection.concat(a),this.setForm(this.currentSelection)},deselectItem:function(a){this.currentSelection.indexOf(a)>-1&&-1===this.removedSelections.indexOf(a)&&this.removedSelections.push(a),this.newSelections.indexOf(a)>-1&&this.newSelections.splice(this.newSelections.indexOf(a),1)},addedItems:function(a){this.sandbox.util.foreach(a,function(a){a&&a.id&&this.selectItem(a.id)}.bind(this))},selectItem:function(a){this.currentSelection.indexOf(a)<0&&this.newSelections.indexOf(a)<0&&this.newSelections.push(a),this.removedSelections.indexOf(a)>-1&&this.removedSelections.splice(this.removedSelections.indexOf(a),1)},submit:function(){this.sandbox.form.validate(b.formSelector)&&(this.sandbox.emit("sulu.products.media.save",this.options.data.id,this.newSelections,this.removedSelections),this.statusChanged&&(this.options.data.attributes.status=this.status,this.sandbox.emit("sulu.products.save",this.options.data.attributes)))},setHeaderBar:function(a){if(a!==this.saved){var b=this.options.data&&this.options.data.attributes.id?"edit":"add";this.sandbox.emit("sulu.header.toolbar.state.change",b,a,!0)}this.saved=a}}});