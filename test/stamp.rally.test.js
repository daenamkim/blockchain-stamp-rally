const shouldFail = require('./../contracts/openzeppelin-solidity/test/helpers/shouldFail.js');

var StampRally = artifacts.require("StampRally.sol");

const should = require('chai').should();

contract('StampRally', function(accounts) {

    let numStamps = 6;
    let name = "Flora and Fauna of the American Southwest"
    
    // Flora and Fauna of the American Southwest
    let p0 = "coyote"
    let p1 = "armadillo"
    let p2 = "roadrunner"
    let p3 = "Teddy bear chola cactus"
    let p4 = "pancake prickly pear"
    let p5 = "kangaroo rat"

    let owner = accounts[0];
    let fiona = accounts[1];

    let u0 = "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/Gpa_bill_coyote_pups_3.jpg/1920px-Gpa_bill_coyote_pups_3.jpg";
    let u1 = "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Nine-banded_Armadillo.jpg/2560px-Nine-banded_Armadillo.jpg";
    let u2 = "https://en.wikipedia.org/wiki/Roadrunner#/media/File:The_Greater_Roadrunner_Walking.jpg";
    let u3 = "https://en.wikipedia.org/wiki/Cylindropuntia_bigelovii#/media/File:Cylindropuntia_bigelovii.jpg";
    let u4 = "http://www.americansouthwest.net/california/photographs700/opuntia-chlorotica.jpg";
    let u5 = "https://en.wikipedia.org/wiki/Kangaroo_rat#/media/File:Kangaroo-rat.jpg";

    let prompt0 = "trickster god"
    let prompt1 = "armored beast"
    let prompt2 = "New Mexico State Bird"
    let prompt3 = "Cute cactus"
    let prompt4 = "Breakfast cactus"
    let prompt5 = "Jumping nezumi"
    
    let h0, h1, h2, h3, h4, h5;
    
    let rally;
    
    beforeEach(async function () {
	rally = await StampRally.new(numStamps, name);
	h0 = await rally.generateHash(p0);
	h1 = await rally.generateHash(p1);
	h2 = await rally.generateHash(p2);
	h3 = await rally.generateHash(p3);
	h4 = await rally.generateHash(p4);
	h5 = await rally.generateHash(p5);

	rally.setStamp(0, h0, u0, prompt0);
	rally.setStamp(1, h1, u1, prompt1);
	rally.setStamp(2, h2, u2, prompt2);
	rally.setStamp(3, h3, u3, prompt3);
	rally.setStamp(4, h4, u4, prompt4);
	rally.setStamp(5, h5, u5, prompt5);
	
    });

    describe("constructor", async function() {
	it("should make a new stamp rally", async function() {
	    assert.equal((await rally.numStamps()).toNumber(), numStamps, "NumStamps didn't match");
	    assert.equal((await rally.name()), name, "Name didn't match");
	    assert.equal((await rally.owner()), owner, "Owner didn't match");
	});
    });

    describe("collectStamp", async function() {
	it("should record a stamp for a user", async function() {
	    assert.isNotOk(await rally.userHasStamp(2, accounts[0]), "Should not have stamp 2");
	    await rally.collectStamp(2, p2);
	    assert.isOk(await rally.userHasStamp(2, accounts[0]), "Should have stamp 2");
	});

	it("should ignore a bad passphrase", async function() {
	    await rally.collectStamp(4, "pink fairy armadillo"); // it's from argentina!!!
	    assert.isNotOk(await rally.userHasStamp(4, accounts[0]), "Stamp should not be present");
	});

	it("should revert on an invalid position", async function() {
	    await shouldFail.reverting(rally.collectStamp(6, "rattlesnake"));
	});
    });

    describe("getStampImage", async function() {
	it("should return an empty string if the stamp is uncollected", async function() {
	    await rally.collectStamp(0, "penguin"); // inits the card
	    for (let i = 0; i < numStamps; i++) {
		assert.equal("", await rally.getStampImage(i), "expected an empty string");
	    }
	});
	it("should return the image url if the stamp is collected", async function() {
	    await rally.collectStamp(3, p3);
	    assert.equal(u3, await rally.getStampImage(3), "Unexpected url");
	});
	it("should revert on an invalid position", async function() {
	    await rally.collectStamp(3, p3);
	    await shouldFail.reverting(rally.getStampImage(6));
	});
	it("should return empty string on an invalid card", async function() {
	    assert.equal("", await rally.getStampImage(1), "expected an empty string");
	});
    });

    describe("getStampPrompt", async function() {
	it("should get a stamp prompt", async function() {
	    assert.equal(prompt0, await rally.getStampPrompt(0));
	    assert.equal(prompt1, await rally.getStampPrompt(1));
	    assert.equal(prompt2, await rally.getStampPrompt(2));
	    assert.equal(prompt3, await rally.getStampPrompt(3));
	    assert.equal(prompt4, await rally.getStampPrompt(4));
	    assert.equal(prompt5, await rally.getStampPrompt(5));
	    
	});
	it("should revert on an invalid position", async function() {
	    await shouldFail.reverting(rally.getStampPrompt(6));
	});
    });

    describe("userHasStamp", async function() {
	it("should return false if the stamp is uncollected", async function() {
	    await rally.collectStamp(0, "penguin", {from: fiona}); // inits the card
	    for (let i = 0; i < numStamps; i++) {
		assert.equal(false, await rally.userHasStamp(i, fiona), "expected an empty string");
	    }
	});

	it("should return true if the stamp is collected", async function() {
	    await rally.collectStamp(5, p5, {from: fiona});
	    assert.equal(true, await rally.userHasStamp(5, fiona), "Expected true");
	});

	it("should revert on an invalid position", async function() {
	    await shouldFail.reverting(rally.userHasStamp(6, fiona));
	});

	it("should return false on an invalid card", async function() {
	    assert.equal(false, await rally.userHasStamp(1, fiona), "Expected false");
	});
	   
    });

    describe("setStamp", async function() {
	it("should allow a stamp to be reset", async function() {
	    rally.setStamp(0, h0, u0, prompt0);
	});
	it("should only allow owner to set a stamp", async function() {
	    await shouldFail.reverting(rally.setStamp(0, h0, u0, prompt0, {from: fiona}));
	});
    });

    describe("transferOwnership", async function() {
	it("should allow the owner to transferOwnership", async function() {
	    rally.transferOwnership(fiona);
	    assert.equal(await rally.pendingOwner(), fiona, "Unexpected pending owner");
	});
	it("should not allo non-owners to transferOwnership", async function() {
	    await shouldFail.reverting(rally.transferOwnership(fiona, {from: fiona}));
	});
    });

    describe("claimOwnership", async function() {
	it("should allow the pending owner to claimOwnership", async function() {
	    rally.transferOwnership(fiona);
	    rally.claimOwnership({from: fiona});
	    assert.equal(await rally.owner(), fiona, "Unexpected owner");
	});
	it("should not allow non-pending owners to claimOwnership", async function() {
	    await shouldFail.reverting(rally.claimOwnership({from: fiona}));
	});
    });
});
