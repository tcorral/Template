TestCase("TemplateConstructorTest", sinon.testCase({
	setUp: function()
	{
		this.oTemplate = new Namespace.Template();
	},
	"test should return an empty string for sTemplate property by default": function()
	{
		assertString(this.oTemplate.sTemplate);
		assertEquals(0, this.oTemplate.sTemplate.length);
	},
	"test should return a documentfragment instance for oDocumentFragment property by default": function()
	{
		assertInstanceOf(DocumentFragment, this.oTemplate.oDocumentFragment);
	},
	"test should return an empty array for aDataElements property by default": function()
	{
		assertArray(this.oTemplate.aDataElements);
		assertEquals(0, this.oTemplate.aDataElements.length);
	},
	"test should return an empty array for aAddedElements property by default": function()
	{
		assertArray(this.oTemplate.aAddedElements);
		assertEquals(0, this.oTemplate.aAddedElements.length);
	},
	"test should return body for tag of oContainer by default": function()
	{
		assertTagName("body", this.oTemplate.oContainer);
	},
	tearDown: function()
	{

	}
}));

TestCase("TemplateSetContainerTest", sinon.testCase({
	setUp: function()
	{
		this.oTemplate = new Namespace.Template();
	},
	"test should not change oContainer if the argument is not a DOM element: null": function()
	{
		this.oTemplate.setContainer(null);

		assertNotNull(this.oTemplate.oContainer);
	},
	"test should not change oContainer if the argument is not a DOM element: undefined": function()
	{
		this.oTemplate.setContainer();

		assertNotNull(this.oTemplate.oContainer);
	},
	"test should change oContainer if the argument is a DOM element: undefined": function()
	{
		/*:DOC += <div id='test'></div>*/

		this.oTemplate.setContainer(document.getElementById('test'));

		assertNotNull(this.oTemplate.oContainer);
	},
	tearDown: function()
	{

	}
}));

TestCase("TemplateCompileTest", sinon.testCase({
	setUp: function()
	{
		this.oTemplate = new Namespace.Template();
	},
	"test should add one element to addElements": function()
	{
		this.oTemplate.compile("<div><!--set--></div>");

		assertEquals(1, this.oTemplate.aDataElements.length)
	},
	"test should add none element to addElements": function()
	{
		this.oTemplate.compile("<div></div>");

		assertEquals(0, this.oTemplate.aDataElements.length)
	},
	tearDown: function()
	{

	}
}));

TestCase("TemplateRenderTest", sinon.testCase({
	setUp: function()
	{
		this.oTemplate = new Namespace.Template();
		sinon.spy(this.oTemplate, "compile");
	},
	"test should call compile method if first argument is a string": function()
	{
		this.oTemplate.render('<div id="test">' + Math.random() + '</div>');

		assertNotNull(document.getElementById("test"));
		assertEquals(1, this.oTemplate.compile.callCount);
	},
	"test should not call compile method if first argument is different from string": function()
	{
		var oLayer = document.createElement("div");
		this.oTemplate.oDocumentFragment.appendChild(oLayer);

		this.oTemplate.render({set: 888});

		assertNull(document.getElementById("test"));
		assertEquals(0, this.oTemplate.compile.callCount);
	},
	tearDown: function()
	{
		this.oTemplate.compile.restore();
	}
}));

