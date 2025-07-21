# Video Files for Personality Results

This directory contains video files that correspond to MBTI personality types from Part 1 of the quiz.

## Required Video Files

Based on the personality mappings in `/public/personality_mappings.csv`, you need to add the following video files:

### ENFJ - The Teacher
- `Kid Singing in Car Seat.mov` - "My stage is wherever my booster seat is."

### ENFP - The Champion  
- `Take On Me Girl.mov` - "Quirky? Absolutely. Embarrassed? Never."

### ENTJ - The Commander
- `Hey I Want to Be Famous.mov` - "Step aside, peasants. I have arrived."

### ENTP - The Visionary (2 subtypes)
- `Free Shavakado.mov` - "I came, I saw, I misread—and I made it iconic."
- `Target.mov` - "I saw a glitch in the matrix and turned it into performance art."

### ESFJ - The Provider
- `I Want a Donut.mov` - "Community matters, but so do carbs."

### ESFP - The Performer
- `Fire Alarm Dance.mov` - "Crisis? I thought this was a performance cue."

### ESTJ - The Supervisor
- `Mind Your Business David.mov` - "I run this household and my soap empire."

### INFJ - The Counselor
- `Nerd.mov` - "Romance is a battlefield and I walked straight into it."

### INFP - The Healer
- `Door Whack.mov` - "I tried to be spooky but life hit me first."

### INTJ - The Mastermind
- `It's Free Real Estate.mov` - "Strategic, subtle, slightly unhinged."

### INTP - The Architect
- `Road Work Ahead.mov` - "Language is my playground. Prepare for dad jokes."

### ISFJ - The Protector
- `Look at All Those Chickens.mov` - "Confidently wrong, but in a cute way."

### ISFP - The Composer
- `Emily Wake Up.mov` - "Life is fleeting, let me nap through it."

### ISTP - The Craftsman
- `Hey Ron Hey Billy.mov` - "I fell out of the ceiling, not out of character."

### ISTJ - The Inspector
- `You Almost Made Me Drop My Croissant.mov` - "I got priorities."

## Video Requirements

- **Format**: .mov, .mp4, or .webm (the system will try multiple formats)
- **Size**: Optimize for web streaming (recommended: 720p or 1080p, compressed)
- **Duration**: 10-30 seconds recommended
- **Content**: Should match the viral video reference and personality type

## Adding Videos

1. Place your video files in this directory
2. Ensure the filename matches exactly what's listed in `personality_mappings.csv`
3. Test the videos by running the quiz and completing Part 1

## MBTI Personality System

The system now calculates MBTI types based on:
- **Extraversion (E/I)**: Social behavior and energy direction
- **Openness (N/S)**: Information processing and creativity
- **Agreeableness (F/T)**: Decision-making and values
- **Conscientiousness (J/P)**: Organization and planning

## Fallback

If a video file is missing, the system will show an error message but allow the user to continue with just the text description and one-liner. 