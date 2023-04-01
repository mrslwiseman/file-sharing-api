import { type StorageStrategy } from './storageContext';
import StorageContext from './storageContext';
import sinon, { SinonStub } from 'sinon';
import { describe, expect, test } from '@jest/globals';

describe('StorageContext', () => {
    let storageStrategyMock: Record<keyof StorageStrategy, SinonStub<any[], any>>;
    let storageContext: StorageContext;

    beforeEach(() => {
        storageStrategyMock = {
            getReadStream: sinon.stub(),
            getWriteStream: sinon.stub(),
            delete: sinon.stub().resolves(),
        };
        storageContext = new StorageContext(storageStrategyMock);
    });

    describe('getReadStream', () => {
        it('should call the getReadStream method of the strategy with the given file', () => {
            const file = 'example.txt';
            storageContext.getReadStream(file);
            sinon.assert.calledOnceWithExactly(storageStrategyMock.getReadStream, file);
        });
    });

    describe('getWriteStream', () => {
        it('should call the getWriteStream method of the strategy with the given file', () => {
            const file = 'example.txt';
            storageContext.getWriteStream(file);
            sinon.assert.calledOnceWithExactly(storageStrategyMock.getWriteStream, file);
        });
    });

    describe('delete', () => {
        it('should call the delete method of the strategy with the given file', async () => {
            const file = 'example.txt';
            await storageContext.delete(file);
            sinon.assert.calledOnceWithExactly(storageStrategyMock.delete, file);
        });

        it('should return the result of the delete method of the strategy', async () => {
            const expectedResult = 'deleted';
            storageStrategyMock.delete.resolves(expectedResult);
            const result = await storageContext.delete('example.txt');
            expect(result).toBe(expectedResult);
        });
    });
});