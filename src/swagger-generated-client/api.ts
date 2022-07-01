/// <reference path="./custom.d.ts" />
// tslint:disable
/**
 * Candlepin
 * Server for fake Candlepin application
 *
 * OpenAPI spec version: 1.0.0
 * Contact: joseph.stone@dataductus.com
 *
 * NOTE: This file is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the file manually.
 */

import * as url from "url";
import * as isomorphicFetch from "isomorphic-fetch";
import { Configuration } from "./configuration";

const BASE_PATH = "/".replace(/\/+$/, "");

/**
 *
 * @export
 */
export const COLLECTION_FORMATS = {
    csv: ",",
    ssv: " ",
    tsv: "\t",
    pipes: "|",
};

/**
 *
 * @export
 * @interface FetchAPI
 */
export interface FetchAPI {
    (url: string, init?: any): Promise<Response>;
}

/**
 *
 * @export
 * @interface FetchArgs
 */
export interface FetchArgs {
    url: string;
    options: any;
}

/**
 *
 * @export
 * @class BaseAPI
 */
export class BaseAPI {
    protected configuration?: Configuration;

    constructor(configuration?: Configuration, protected basePath: string = BASE_PATH, protected fetch: FetchAPI = isomorphicFetch) {
        if (configuration) {
            this.configuration = configuration;
            this.basePath = configuration.basePath || this.basePath;
        }
    }
};

/**
 *
 * @export
 * @class RequiredError
 * @extends {Error}
 */
export class RequiredError extends Error {
    name = "RequiredError"
    constructor(public field: string, msg?: string) {
        super(msg);
    }
}

/**
 * 
 * @export
 * @interface Frame
 */
export interface Frame {
    /**
     * 
     * @type {Array<FramePlayers>}
     * @memberof Frame
     */
    players: Array<FramePlayers>;
    /**
     * 
     * @type {boolean}
     * @memberof Frame
     */
    complete: boolean;
    /**
     * 
     * @type {boolean}
     * @memberof Frame
     */
    active: boolean;
    /**
     * 
     * @type {number}
     * @memberof Frame
     */
    number: number;
}
/**
 * 
 * @export
 * @interface FramePlayers
 */
export interface FramePlayers {
    /**
     * Player ID
     * @type {string}
     * @memberof FramePlayers
     */
    player: string;
    /**
     * 
     * @type {Mark}
     * @memberof FramePlayers
     */
    mark?: Mark;
    /**
     * 
     * @type {Array<number>}
     * @memberof FramePlayers
     */
    downed?: number[];
    /**
     * 
     * @type {number}
     * @memberof FramePlayers
     */
    ball?: number;
    /**
     * 
     * @type {boolean}
     * @memberof FramePlayers
     */
    active?: boolean;
}
/**
 * An array of Frame objects in chronological order (e.g. index 0, is Frame 1, and index 9 is Frame 10 - the last frame)
 * @export
 */
export type Frames = Array<Frame>
/**
 * 
 * @export
 * @interface Game
 */
export interface Game {
    /**
     * 
     * @type {Date}
     * @memberof Game
     */
    started?: Date;
    /**
     * 
     * @type {Date}
     * @memberof Game
     */
    completed?: Date;
    /**
     * 
     * @type {string}
     * @memberof Game
     */
    id: string;
    /**
     * 
     * @type {number}
     * @memberof Game
     */
    lane: number;
    /**
     * 
     * @type {Frames}
     * @memberof Game
     */
    frames: Frames;
    /**
     * 
     * @type {Frame}
     * @memberof Game
     */
    currentFrame?: Frame;
}
/**
 * 
 * @export
 * @interface GameIdRollBody
 */
export interface GameIdRollBody {
    /**
     * 
     * @type {number}
     * @memberof GameIdRollBody
     */
    downed: number;
}
/**
 * 
 * @export
 * @enum {string}
 */
export enum Mark {
    Spare = <any> 'spare',
    Strike = <any> 'strike',
    Ten = <any> 'ten'
}
/**
 * 
 * @export
 * @interface Player
 */
export interface Player {
    /**
     * 
     * @type {string}
     * @memberof Player
     */
    id: string;
    /**
     * 
     * @type {string}
     * @memberof Player
     */
    name?: string;
}
/**
 * DefaultApi - fetch parameter creator
 * @export
 */
export const DefaultApiFetchParamCreator = function (configuration?: Configuration) {
    return {
        /**
         * 
         * @param {string} gameId 
         * @param {GameIdRollBody} [body] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        gameGameIdRollPut(gameId: string, body?: GameIdRollBody, options: any = {}): FetchArgs {
            // verify required parameter 'gameId' is not null or undefined
            if (gameId === null || gameId === undefined) {
                throw new RequiredError('gameId','Required parameter gameId was null or undefined when calling gameGameIdRollPut.');
            }
            const localVarPath = `/game/{game_id}/roll`
                .replace(`{${"game_id"}}`, encodeURIComponent(String(gameId)));
            const localVarUrlObj = url.parse(localVarPath, true);
            const localVarRequestOptions = Object.assign({ method: 'PUT' }, options);
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            localVarHeaderParameter['Content-Type'] = 'application/json';

            localVarUrlObj.query = Object.assign({}, localVarUrlObj.query, localVarQueryParameter, options.query);
            // fix override query string Detail: https://stackoverflow.com/a/7517673/1077943
            delete (localVarUrlObj as any).search;
            localVarRequestOptions.headers = Object.assign({}, localVarHeaderParameter, options.headers);
            const needsSerialization = (<any>"GameIdRollBody" !== "string") || localVarRequestOptions.headers['Content-Type'] === 'application/json';
            localVarRequestOptions.body =  needsSerialization ? JSON.stringify(body || {}) : (body || "");

            return {
                url: url.format(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @param {string} [id] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        gamesGet(id?: string, options: any = {}): FetchArgs {
            const localVarPath = `/games`;
            const localVarUrlObj = url.parse(localVarPath, true);
            const localVarRequestOptions = Object.assign({ method: 'GET' }, options);
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            if (id !== undefined) {
                localVarQueryParameter['id'] = id;
            }

            localVarUrlObj.query = Object.assign({}, localVarUrlObj.query, localVarQueryParameter, options.query);
            // fix override query string Detail: https://stackoverflow.com/a/7517673/1077943
            delete (localVarUrlObj as any).search;
            localVarRequestOptions.headers = Object.assign({}, localVarHeaderParameter, options.headers);

            return {
                url: url.format(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
    }
};

/**
 * DefaultApi - functional programming interface
 * @export
 */
export const DefaultApiFp = function(configuration?: Configuration) {
    return {
        /**
         * 
         * @param {string} gameId 
         * @param {GameIdRollBody} [body] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        gameGameIdRollPut(gameId: string, body?: GameIdRollBody, options?: any): (fetch?: FetchAPI, basePath?: string) => Promise<Response> {
            const localVarFetchArgs = DefaultApiFetchParamCreator(configuration).gameGameIdRollPut(gameId, body, options);
            return (fetch: FetchAPI = isomorphicFetch, basePath: string = BASE_PATH) => {
                return fetch(basePath + localVarFetchArgs.url, localVarFetchArgs.options).then((response) => {
                    if (response.status >= 200 && response.status < 300) {
                        return response;
                    } else {
                        throw response;
                    }
                });
            };
        },
        /**
         * 
         * @param {string} [id] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        gamesGet(id?: string, options?: any): (fetch?: FetchAPI, basePath?: string) => Promise<Array<Game>> {
            const localVarFetchArgs = DefaultApiFetchParamCreator(configuration).gamesGet(id, options);
            return (fetch: FetchAPI = isomorphicFetch, basePath: string = BASE_PATH) => {
                return fetch(basePath + localVarFetchArgs.url, localVarFetchArgs.options).then((response) => {
                    if (response.status >= 200 && response.status < 300) {
                        return response.json();
                    } else {
                        throw response;
                    }
                });
            };
        },
    }
};

/**
 * DefaultApi - factory interface
 * @export
 */
export const DefaultApiFactory = function (configuration?: Configuration, fetch?: FetchAPI, basePath?: string) {
    return {
        /**
         * 
         * @param {string} gameId 
         * @param {GameIdRollBody} [body] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        gameGameIdRollPut(gameId: string, body?: GameIdRollBody, options?: any) {
            return DefaultApiFp(configuration).gameGameIdRollPut(gameId, body, options)(fetch, basePath);
        },
        /**
         * 
         * @param {string} [id] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        gamesGet(id?: string, options?: any) {
            return DefaultApiFp(configuration).gamesGet(id, options)(fetch, basePath);
        },
    };
};

/**
 * DefaultApi - object-oriented interface
 * @export
 * @class DefaultApi
 * @extends {BaseAPI}
 */
export class DefaultApi extends BaseAPI {
    /**
     * 
     * @param {string} gameId 
     * @param {GameIdRollBody} [body] 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DefaultApi
     */
    public gameGameIdRollPut(gameId: string, body?: GameIdRollBody, options?: any) {
        return DefaultApiFp(this.configuration).gameGameIdRollPut(gameId, body, options)(this.fetch, this.basePath);
    }

    /**
     * 
     * @param {string} [id] 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DefaultApi
     */
    public gamesGet(id?: string, options?: any) {
        return DefaultApiFp(this.configuration).gamesGet(id, options)(this.fetch, this.basePath);
    }

}
