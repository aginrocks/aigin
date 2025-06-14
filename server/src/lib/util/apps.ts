import { APPS } from '@constants/apps';
import { AppConfig, TAppConfig } from '@models/app-config';

export function parseAppMentions(text: string): { mentions: string[]; cleanedText: string } {
    const mentionRegex = /@\{app:([^}]+)\}/g;
    const mentions: string[] = [];

    // Collect mentions while avoiding escaped ones
    const matches = Array.from(text.matchAll(mentionRegex));

    for (const match of matches) {
        // Check if escaped
        if (match.index! > 0 && text[match.index! - 1] === '\\') {
            continue;
        }
        mentions.push(match[1]);
    }

    // Remove non-escaped mentions and normalize whitespace
    const cleanedText = text
        .replace(/(^|[^\\])@\{app:[^}]+\}/g, '$1')
        .replace(/\s+/g, ' ')
        .trim();

    const uniqueMentions = Array.from(new Set(mentions));

    return { mentions: uniqueMentions, cleanedText };
}

export type ValidateProps = {
    requestedApps: string[];
    userId: string;
};

export type ValidateResult =
    | {
          possible: false;
          errorMessage: string;
      }
    | {
          possible: true;
          configs?: TAppConfig[];
      };

export async function validateAppsRequest({
    requestedApps,
    userId,
}: ValidateProps): Promise<ValidateResult> {
    if (requestedApps.length === 0) {
        return { possible: true };
    }

    if (requestedApps.length > 3) {
        return {
            possible: false,
            errorMessage: 'You can only use up to 3 apps at a time.',
        };
    }

    const allAppsValid = requestedApps.every((app) => APPS.some((a) => a.slug === app));
    if (!allAppsValid) {
        return {
            possible: false,
            errorMessage: 'One or more requested apps are not valid.',
        };
    }

    const userConfigs = await AppConfig.find({
        user: userId,
        appSlug: { $in: requestedApps },
        enabled: true,
    });

    if (userConfigs.length !== requestedApps.length) {
        return {
            possible: false,
            errorMessage: 'You must configure all requested apps before using them.',
        };
    }

    return { possible: true, configs: userConfigs };
}
