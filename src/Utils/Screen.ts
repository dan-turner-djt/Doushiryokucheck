export function getWidth(screenWidth: number, maxWidthPercent: number, minWidthPercent: number, maxWidth: number): number {

	if (screenWidth * (maxWidthPercent/100) > maxWidth) {
		
		if (screenWidth * (minWidthPercent/100) < maxWidth) {
			return (maxWidth/screenWidth)*100;
		}

		return minWidthPercent;
	}

	return maxWidthPercent;
}