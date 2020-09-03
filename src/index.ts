import {OnProgressFunction, PromiseFunction} from "./interfaces";

export * from './interfaces';

/**
 * controlledPromiseList
 *
 * @param {array} promiseFunctionList A list of functions for Promise instantiation.
 * @param {number} concurrentRunNumber Number of promise that run concurrently at a given time.
 * @param {function} onProgress a function with the following signature : (doneCount, remainingCount) => {}
 *
 * @return Promise
 */
export default async function controlledPromiseList(
    promiseFunctionList: PromiseFunction[],
    concurrentRunNumber: number = 10,
    onProgress: OnProgressFunction|null = null
): Promise<any> {
    return new Promise((resolve: any, reject: any) => {
        const responses: any[] = [];
        const totalNumber: number = promiseFunctionList.length;

        const recursive = (promisesList: PromiseFunction[], currentIndex: number = 0): void => {
            const functionToRun = promisesList.slice(currentIndex, currentIndex + concurrentRunNumber);

            Promise
                .all(functionToRun.map((f: PromiseFunction) => new Promise(f)))
                .then((runResponses) => {

                    responses.push(
                        ...runResponses
                    );

                    if (onProgress) {
                        onProgress(responses.length, totalNumber);
                    }

                    if (responses.length === totalNumber) {
                        resolve(responses);
                    } else {
                        recursive(promisesList, currentIndex + concurrentRunNumber);
                    }
                })
                .catch(reject)
        };

        recursive(promiseFunctionList);
    });
}
