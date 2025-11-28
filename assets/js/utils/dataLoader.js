/**
 * Utility to load JSON data for sections
 */
export async function loadData(sectionName) {
    try {
        const response = await fetch(`data/${sectionName}-data.json`);
        if (!response.ok) {
            throw new Error(`Failed to load data for ${sectionName}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Error loading ${sectionName} data:`, error);
        return null;
    }
}
