// @ts-ignore
import * as soda from 'soda-js';

let _consumer: any;
let _consumerDataSet: string;

/**
 * Initializes the soda consumer so it is ready to make queries
 * @param apiToken - apiToken for the consumer you want to access
 * @param consumerDomain - domain of the consumer you are querying (e.g. 'data.sfgov.org')
 * @param consumerDataSet - dataset that is being queried (e.g. "wg3w-h783")
 */
function initializeSodaConsumer(apiToken: string, consumerDomain: string, consumerDataSet: string): void {
    _consumerDataSet = consumerDataSet;
    _consumer = new soda.Consumer(consumerDomain,
        {
            apiToken: apiToken
        }
    );
}

interface queryOptions {
    where?: string | Record<string, unknown>,
    select?: Array<string>,
    group?: string,
    limit: number
}

/**
 * Queries the soda api and returns a dataset as a promise
 * TODO get rid of external soda-js library and just use axios or fetch
 * @param options
 *   - select - accepts an array of column names to be in the SELECT statement - e.g. ['id', 'name', ...etc]
 *   - where - a series of WHERE clauses to apply
 *   - group - for GROUP BY equivalent
 *   - limit - maximum number of records to return
 */
function query(options: queryOptions): Promise<any> {
    return new Promise(
        (resolve, reject) => {
            let newQuery = _consumer
                .query()
                .withDataset(_consumerDataSet);

            if (options.where) {
                newQuery = newQuery.where(options.where);
            }
            if (options.select) {
                newQuery = newQuery.select(...options.select);
            }
            if (options.group) {
                newQuery = newQuery.group(options.group);
            }
            if (options.limit) {
                newQuery = newQuery.limit(options.limit);
            }

            newQuery
                .getRows()
                .on('success',
                    function (response: any) {
                        resolve(response);
                    }
                ).on('error',
                    function (error: any) {
                        reject(error);
                    }
            );
        }
    );
}

export {initializeSodaConsumer, query}

