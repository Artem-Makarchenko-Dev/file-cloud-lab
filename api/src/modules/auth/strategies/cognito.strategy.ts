import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { passportJwtSecret } from 'jwks-rsa';

type CognitoJwtPayload = {
  sub: string;
  email: string;
  'cognito:groups'?: string[];
  token_use: string;
};

@Injectable()
export class CognitoStrategy extends PassportStrategy(Strategy, 'cognito') {
  constructor(config: ConfigService) {
    super({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        ignoreExpiration: false,
        secretOrKeyProvider: passportJwtSecret({
            cache: true,
            rateLimit: true,
            jwksRequestsPerMinute: 5,
            jwksUri: `${config.getOrThrow('COGNITO_ISSUER')}/.well-known/jwks.json`,
        }),
        algorithms: ['RS256'],
    });
  }

  async validate(payload: CognitoJwtPayload) {
    console.log('Cognito payload:', JSON.stringify(payload));
    if (payload.token_use !== 'access') {
      throw new UnauthorizedException('Invalid token type');
    }

    return {
      cognitoId: payload.sub,
      email: payload.email,
      groups: payload['cognito:groups'] ?? [],
    };
  }
}