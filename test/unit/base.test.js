var expect = require('chai').expect,
  Converter = require('../../index.js'),
  fs = require('fs'),
  _ = require('lodash'),
  VALID_RAML_DIR_PATH = './test/fixtures/valid-raml';

/**
* Used to remove property id of a json object
*
* @param {object} obj - collection object
* @returns {void}
*/
function removeId (obj) {
  _.has(obj, 'id') && delete obj.id;
  _.has(obj, '_postman_id') && delete obj._postman_id;

  for (var item in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, item)) {
      typeof obj[item] === 'object' && removeId(obj[item]);
    }
  }
}

describe('CONVERT FUNCTION TESTS ', function() {
  describe('The converter should convert the input with different types', function() {
    it('(type: string)', function (done) {
      var data = fs.readFileSync(VALID_RAML_DIR_PATH + '/validRaml.raml').toString(),
        input = {
          data: data,
          type: 'string'
        };

      Converter.convert(input, {}, function(err, result) {
        expect(err).to.be.null;
        expect(result.result).to.equal(true);
        result.output.forEach(function (element) {
          expect(['collection', 'request', 'environment']).to.include(element.type);
          if (element.type === 'collection') {
            expect(element.data).to.have.property('info');
            expect(element.data).to.have.property('item');
          }
          else if (element.type === 'request') {
            expect(element.data).to.have.property('url');
          }
          else if (element.type === 'environment') {
            expect(element.data).to.have.property('values');
          }
        });
        done();
      });
    });

    it('(type: file)', function (done) {
      var input = {
        data: VALID_RAML_DIR_PATH + '/validRaml.raml',
        type: 'file'
      };

      Converter.convert(input, {}, function(err, result) {
        expect(err).to.be.null;
        expect(result.result).to.equal(true);
        result.output.forEach(function (element) {
          expect(['collection', 'request', 'environment']).to.include(element.type);
          if (element.type === 'collection') {
            expect(element.data).to.have.property('info');
            expect(element.data).to.have.property('item');
          }
          else if (element.type === 'request') {
            expect(element.data).to.have.property('url');
          }
          else if (element.type === 'environment') {
            expect(element.data).to.have.property('values');
          }
        });
        done();
      });
    });
  });

  it('The converter should convert basic raml spec to postman collection' +
      'with proper headers, body, responses and security schemes', function(done) {
    let collectionFixture = JSON.parse(fs.readFileSync(
        VALID_RAML_DIR_PATH + '/ramlSpecBasicCollection.json'
      ).toString()),
      collectionJSON;

    Converter.convert({
      type: 'file',
      data: VALID_RAML_DIR_PATH + '/ramlSpecBasic.raml'
    }, null, (err, conversionResult) => {
      expect(err).to.be.null;
      expect(conversionResult.result).to.equal(true);
      expect(conversionResult.output.length).to.equal(1);
      expect(conversionResult.output[0].type).to.equal('collection');

      collectionJSON = conversionResult.output[0].data;
      removeId(collectionJSON);
      expect(collectionJSON).to.be.an('object');
      expect(collectionJSON).to.deep.equal(collectionFixture);
      done();
    });
  });

  it('The converter should convert raml spec with raml types being used' +
      'in headers, body, query parameters and uri parameters', function(done) {
    let collectionFixture = JSON.parse(fs.readFileSync(
        VALID_RAML_DIR_PATH + '/ramlSpecTypesCollection.json'
      ).toString()),
      collectionJSON;

    Converter.convert({
      type: 'file',
      data: VALID_RAML_DIR_PATH + '/ramlSpecTypes.raml'
    }, null, (err, conversionResult) => {
      expect(err).to.be.null;
      expect(conversionResult.result).to.equal(true);
      expect(conversionResult.output.length).to.equal(1);
      expect(conversionResult.output[0].type).to.equal('collection');

      collectionJSON = conversionResult.output[0].data;
      removeId(collectionJSON);
      expect(collectionJSON).to.be.an('object');
      expect(collectionJSON).to.deep.equal(collectionFixture);
      done();
    });
  });

  it('The converter should convert raml spec with raml traits being used' +
      'in different resources', function(done) {
    let collectionFixture = JSON.parse(fs.readFileSync(
        VALID_RAML_DIR_PATH + '/ramlSpecTraitsCollection.json'
      ).toString()),
      collectionJSON;

    Converter.convert({
      type: 'file',
      data: VALID_RAML_DIR_PATH + '/ramlSpecTraits.raml'
    }, null, (err, conversionResult) => {
      expect(err).to.be.null;
      expect(conversionResult.result).to.equal(true);
      expect(conversionResult.output.length).to.equal(1);
      expect(conversionResult.output[0].type).to.equal('collection');

      collectionJSON = conversionResult.output[0].data;
      removeId(collectionJSON);
      expect(collectionJSON).to.be.an('object');
      expect(collectionJSON).to.deep.equal(collectionFixture);
      done();
    });
  });

  it('The converter should convert raml spec with examples being used' +
      'in different resources', function(done) {
    let collectionFixture = JSON.parse(fs.readFileSync(
        VALID_RAML_DIR_PATH + '/ramlSpecExamplesCollection.json'
      ).toString()),
      collectionJSON;

    Converter.convert({
      type: 'file',
      data: VALID_RAML_DIR_PATH + '/ramlSpecExamples.raml'
    }, null, (err, conversionResult) => {
      expect(err).to.be.null;
      expect(conversionResult.result).to.equal(true);
      expect(conversionResult.output.length).to.equal(1);
      expect(conversionResult.output[0].type).to.equal('collection');

      collectionJSON = conversionResult.output[0].data;
      removeId(collectionJSON);
      expect(collectionJSON).to.be.an('object');
      expect(collectionJSON).to.deep.equal(collectionFixture);
      done();
    });
  });
});

/* Plugin Interface Tests */
describe('INTERFACE FUNCTION TESTS ', function () {
  describe('The converter should validate the input with different types', function() {
    it('(type: file)', function (done) {
      expect(Converter.validate({ data: VALID_RAML_DIR_PATH + '/validRaml.raml', type: 'file' }).result).to.equal(true);
      done();
    });

    it('(type: string)', function (done) {
      var data = fs.readFileSync(VALID_RAML_DIR_PATH + '/validRaml.raml').toString(),
        input = {
          data: data,
          type: 'string'
        };

      expect(Converter.validate(input).result).to.equal(true);
      done();
    });
  });

  describe('The converter must throw an error for invalid input type', function() {
    it('(type: some invalid value)', function(done) {
      var result = Converter.validate({ type: 'invalidType', data: 'invalid_path' });

      expect(result.result).to.equal(false);
      expect(result.reason).to.equal('input type: invalidType is not valid');
      Converter.convert({ type: 'invalidType', data: 'invalid_path' }, {}, function(err, conversionResult) {
        expect(conversionResult.result).to.equal(false);
        expect(conversionResult.reason).to.equal('input type: invalidType is not valid');
        done();
      });
    });
  });

  describe('The converter must throw an error for invalid input path', function() {
    it('(type: file)', function(done) {
      var result = Converter.validate({ type: 'file', data: 'invalid_path' });

      expect(result.result).to.equal(false);
      Converter.convert({ type: 'file', data: 'invalid_path' }, {}, function(err) {
        expect(err.toString()).to.equal('Error: ENOENT: no such file or directory, open \'invalid_path\'');
        done();
      });
    });
  });
});
