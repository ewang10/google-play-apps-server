const expect = require('chai').expect;
const supertest = require('supertest');
const app = require('../app');

describe('GET /apps', () => {
    it('should return a list of apps', () => {
        return supertest(app)
            .get('/apps')
            .expect(200)
            .expect('Content-Type', /json/)
            .then(res => {
                expect(res.body).to.be.an('array');
                expect(res.body).to.have.lengthOf.at.least(1);
                const app = res.body[0];
                expect(app).to.include.all.keys(
                    'App','Rating','Genres'
                );
            });
    });
    it('should be 400 if sort is incorrect', () => {
        return supertest(app)
            .get('/apps')
            .query({sort: 'MISTAKE'})
            .expect(400, 'Sort must be one of rating or app.');
    });
    it('should sort by app', () => {
        return supertest(app)
            .get('/apps')
            .query({sort: 'app'})
            .expect(200)
            .expect('Content-Type', /json/)
            .then(res => {
                expect(res.body).to.be.an('array');
                let sorted = true;
                let i = 0;
                while (i < res.body.length - 1) {
                    const appAtI = res.body[i];
                    const appAtIPlus1 = res.body[i + 1];
                    if (appAtIPlus1 < appAtI) {
                        sorted = false;
                        break;
                    }
                    i++;
                }
                expect(sorted).to.be.true;
            });
    });
});