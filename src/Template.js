(function (NS, global, doc) {
	'use strict';
	doc = global.document;
	if (typeof NS === "undefined") {
		NS = global;
	}
	function removeAddedElements(aElements) {
		var oElement = null;
		while (Boolean(oElement = aElements.shift())) {
			oElement.parentNode.removeChild(oElement);
		}
		oElement = null;
	}
	function getValue(oElement) {
		return oElement.nodeValue;
	}
	function parseData(oDataReplacement, aDataElements, aAddedElements) {
		var nData = 0,
			aElements = aDataElements.concat(),
			nLenData = aElements.length,
			oElement = null,
			sKey = '',
			sValue = '',
			oAddedElement = null;
		for (nData = 0; nData < nLenData; nData = nData + 1) {
			oElement = aElements[nData];
			sKey = getValue(oElement);
			sValue = oDataReplacement[sKey];
			if (typeof sValue !== "undefined") {
				oAddedElement = doc.createTextNode(sValue);
				aAddedElements.push(oAddedElement);
				oElement.parentNode.insertBefore(oAddedElement, oElement);
			}
		}
		nData = aElements = nLenData = oElement = sKey = sValue = oAddedElement = null;
	}
	function parseHTML(oDom, aDataElements) {
		var nChild = 0,
			nLenChilds = 0,
			oElement = null;

		if (!oDom.nodeType) {
			return;
		}
		if (oDom.hasChildNodes()) {
			nLenChilds = oDom.childNodes.length;
			for (nChild = 0; nChild < nLenChilds; nChild = nChild + 1) {
				oElement = oDom.childNodes[nChild];
				parseHTML(oElement, aDataElements);
			}
		} else {
			if (oDom.nodeType === 8) {
				aDataElements.push(oDom);
			}
		}
	}
	var EnumRender = {
			FIRST_ARGUMENT_IS_OBJECT: 0,
			FIRST_ARGUMENT_IS_STRING: 1
		},
		renderActions = [],
		TemplateCache = {},
		Template = function () {
			this.sTemplate = '';
			this.oDocumentFragment = doc.createDocumentFragment();
			this.aDataElements = [];
			this.aAddedElements = [];
			this.oContainer = doc.body;
		};

	renderActions[EnumRender.FIRST_ARGUMENT_IS_OBJECT] = function (oData) {
		if (this.aDataElements.length) {
			parseData(oData, this.aDataElements, this.aAddedElements);
		}
	};
	renderActions[EnumRender.FIRST_ARGUMENT_IS_STRING] = function (sTemplate, oData) {
		this.compile(sTemplate);
		parseData(oData, this.aDataElements, this.aAddedElements);
	};

	Template.prototype.setContainer = function (oContainer) {
		if (!oContainer || typeof oContainer.nodeType === "undefined") {
			return;
		}
		this.oContainer = oContainer;
		return this;
	};
	Template.prototype.compile = function (sTemplate) {
		if (typeof TemplateCache[sTemplate] !== "undefined") {
			return TemplateCache[sTemplate];
		} else {
			var oLayer = doc.createElement("div");
			oLayer.innerHTML = sTemplate;
			this.oDocumentFragment.appendChild(oLayer);
			parseHTML(oLayer, this.aDataElements);
			TemplateCache[sTemplate] = this;
		}
		return this;
	};
	Template.prototype.render = function (oFirstArgument) {
		var nType  = Number(typeof oFirstArgument === "string");
		removeAddedElements(this.aAddedElements);
		renderActions[nType].apply(this, arguments);
		this.oContainer.appendChild(this.oDocumentFragment.childNodes[0].cloneNode(true));
	};

	NS.Template = Template;
}(Namespace, window));
