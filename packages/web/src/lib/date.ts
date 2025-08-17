/**
 * 誕生日から年齢を計算
 * @param birthday yyyy-mm-dd
 * @returns
 */
export function calculateAge(birthday: string): number {
    const birthTimestamp = new Date(birthday).getTime();
    const nowTimestamp = Date.now();
    const ageInMilliseconds = nowTimestamp - birthTimestamp;
    return Math.floor(ageInMilliseconds / (1000 * 60 * 60 * 24 * 365.25));
}
