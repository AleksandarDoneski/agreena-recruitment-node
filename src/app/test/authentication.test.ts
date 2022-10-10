import { User } from "../../database";
import sinon from 'sinon';
import { authMiddleware, checkCredentials, generateJwtToken, isTokenValid } from "../authentication/authentication";
import { expect } from 'chai';
import jwt from 'jsonwebtoken';
import { Request, Response } from "express";

describe('Authentication:', () => {

    const sandbox = sinon.createSandbox();

    afterEach(() => {
        sandbox.restore();
    })

    describe('checkCredentials:', () => {
        it('should return user information if credentials are ok', async () => {
            // Arrange
            const body = {
                email: 'mock_username',
                password: 'mock_password'
            };
            sandbox.stub(User, 'findOne').resolves({
                getDataValue: (val: string) => {
                    switch(val) {
                        case 'Name':
                            return 'mock_name';
                        case 'Username':
                            return  'mock_username';
                        case 'Password':
                            return 'mock_password';
                    }
                }
            } as any);

            // Act
            const result = await checkCredentials(body);

            // Assert
            expect(result).to.be.eqls({
                Name: 'mock_name',
                Username: 'mock_username'
            })
        })

        it('should return null if credentials are wrong', async () => {
            // Arrange
            const body = {
                email: 'mock_username',
                password: 'mock_password2'
            };
            sandbox.stub(User, 'findOne').resolves({
                getDataValue: (val: string) => {
                    switch(val) {
                        case 'Name':
                            return 'mock_name';
                        case 'Username':
                            return  'mock_username';
                        case 'Password':
                            return 'mock_password';
                    }
                }
            } as any);

            // Act
            const result = await checkCredentials(body);

            // Assert
            expect(result).to.be.null;
        })

        it('should return null if user does not exist', async () => {
            // Arrange
            const body = {
                email: 'mock_username',
                password: 'mock_password2'
            };
            sandbox.stub(User, 'findOne').resolves(null);

            // Act
            const result = await checkCredentials(body);

            // Assert
            expect(result).to.be.null;
        })
    })

    describe('generateJwtToken:', () => {
        it('should return a jwt token', () => {
            // Arrange
            const mockUserData = {
                Username: 'mock_username',
                Name: 'mock_name',
            };
            sandbox.stub(jwt, 'sign').returns('mock_token' as unknown as any);

            // Act
            const result = generateJwtToken(mockUserData);

            // Assert
            expect(result).to.be.eq('mock_token');
        });
    });

    describe('isTokenValid:', () => {
        it('should return true if token is valid', () => {
            // Arrange
            const mockToken = 'mock_token';
            sandbox.stub(jwt, 'verify').returns(true as unknown as any);
            // Act
            const result = isTokenValid(mockToken);

            // Arrange
            expect(result).to.be.true;
        });

        it('should return false if token is invalid', () => {
            // Arrange
            const mockToken = 'mock_token';
            sandbox.stub(jwt, 'verify').returns(false as unknown as any);

            // Act
            const result = isTokenValid(mockToken);

            // Arrange
            expect(result).to.be.false;
        })
    });

    describe('authMiddleware:', () => {
        it('should call next if token is valid', () => {
            // Arrange
            const mockRequest = {
                cookies: {
                    'auth-token': 'mock_token'
                }
            } as Request;
            const mockResponse = {} as Response;
            const mockNextSpy = sandbox.fake.returns(null);
            sandbox.stub(jwt, 'verify').resolves(true);

            // Act
            authMiddleware(mockRequest, mockResponse, mockNextSpy);

            // Assert
            expect(mockNextSpy.calledOnce).to.be.true;
        })

        it('should redirect if auth token is missing', () => {
            // Arrange
            const mockRequest = {
                cookies: {}
            } as Request;
            const mockResponse = {
                redirect(url: string) {}
            } as Response;
            const mockNextSpy = sandbox.fake.returns(null);
            const mockResponseSpy = sandbox.spy(mockResponse);
            const jwtStub = sandbox.stub(jwt, 'verify').resolves(true);


            // Act
            authMiddleware(mockRequest, mockResponse, mockNextSpy);

            // Assert
            expect(mockResponseSpy.redirect.calledOnce).to.be.true;
            expect(mockNextSpy.notCalled).to.be.true;
            expect(jwtStub.notCalled).to.be.true;
        })

        it('should redirect if auth token is invalid', () => {
            // Arrange
            const mockRequest = {
                cookies: {
                    'auth-token': 'mock_auth'
                }
            } as Request;
            const mockResponse = {
                redirect(url: string) {}
            } as Response;
            const mockNextSpy = sandbox.fake.returns(null);
            const mockResponseSpy = sandbox.spy(mockResponse);
            const jwtStub = sandbox.stub(jwt, 'verify').returns(undefined)


            // Act
            authMiddleware(mockRequest, mockResponse, mockNextSpy);

            // Assert
            expect(mockResponseSpy.redirect.calledOnce).to.be.true;
            expect(mockNextSpy.notCalled).to.be.true;
            expect(jwtStub.calledOnce).to.be.true;
        })
    })
})
