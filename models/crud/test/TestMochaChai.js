var expect    = require("chai").expect;
var prueba = require("../src/js/app");

describe("App tests using EXPECT interface from CHAI module: ", function() {
	describe("Check addTested Function: ", function() {
		it("Check the returned value using: expect(value).to.equal('value'): ", function() {
			result   = prueba.cantidadDeUsuarios();
			expect(result).to.equal(0);
		});		
		/*
		it("Check the returned value using: expect(value).to.be.a('value')): ", function() {
			result   = calculator.addTested("text");
			expect(result).to.be.a('string');
		});		
		it("Check the returned value using: expect(value).to.have.lengthOf(value): ", function() {
			result   = calculator.addTested("text");
			expect(result).to.have.lengthOf(11);
		});		
		*/
	});
});