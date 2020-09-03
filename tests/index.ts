import controlledPromiseList from '../src/index';
import { expect } from 'chai';
import 'mocha';

function between(min: number, max: number): number {
    return Math.floor(
        Math.random() * (max - min) + min
    )
}

describe('Check concurrency',  () => {

    const inputs = [ 1, 2, 3, 4, 5 ];
    const expectedResults = [ 1, 4, 9, 16, 25 ];
    let progress: string[] = [];

    const promiseFunctionList = inputs.map((x) => {
        return (resolve: any) => {
            setTimeout(() => {
                resolve(x * x)
            }, between(1000, 3000))
        }
    })

    beforeEach(() => {
        progress = [];
    })

    it('should run promises 2 by 2', async () => {

        const promiseFunctionList = inputs.map((x) => {
            return (resolve: any) => {
                setTimeout(() => {
                    resolve(x * x)
                }, between(1000, 3000))
            }
        })

        const progress: string[] = []
        const results = await controlledPromiseList(
            promiseFunctionList,
            2,
            (doneNumber, remainingNumber) => {
                progress.push(doneNumber + '/' +remainingNumber);
            }
        );

        expect(results).to.be.an('array');
        expect(results).to.deep.equal(expectedResults)
        expect(progress).to.deep.equal([
            '2/5',
            '4/5',
            '5/5'
        ])

    });

    it('should run promises sequentially', async () => {

        const results = await controlledPromiseList(
            promiseFunctionList,
            1,
            (doneNumber, remainingNumber) => {
                progress.push(doneNumber + '/' +remainingNumber);
            }
        );

        expect(results).to.be.an('array');
        expect(results).to.deep.equal(expectedResults)
        expect(progress).to.deep.equal([
            '1/5',
            '2/5',
            '3/5',
            '4/5',
            '5/5'
        ])

    });



});

describe('Check error handling', () => {
    it('Fail with reject',  (done) => {

        const inputs = [ 1, 2, 3 ];
        const promiseFunctionList = inputs.map((x) => {
            return (resolve: any, reject: any) => {

                if(x > 2){
                    reject(new Error('test'))
                }else{
                    resolve(x)
                }

            }
        })

        controlledPromiseList(
            promiseFunctionList,
            1,
        )
            .catch((error) => {
                expect(error.message).to.equal( 'test');
                done()
            })


    });

    it('Fail with throw',  (done) => {

        const inputs = [ 1, 2, 3 ];
        const promiseFunctionList = inputs.map((x) => {
            return (resolve: any) => {

                if(x > 2){
                    throw new Error('test')
                }else{
                    resolve(x)
                }

            }
        })

        controlledPromiseList(
            promiseFunctionList,
            2,
        )
            .catch((error) => {
                expect(error.message).to.equal( 'test');
                done()
            })


    });
})