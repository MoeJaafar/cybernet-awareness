import type { Scenario } from "@/lib/types";

export const vishing: Scenario = {
    id: "vishing-helpdesk",
    title: "مكالمة من «دعم Microsoft»",
    concept:
        "التصيّد الصوتي (Vishing): الهندسة الاجتماعية عبر الهاتف، وادعاء الهوية، ولماذا لا تتّصل بك شركات التقنية أبدًا لتطلب كلمة مرورك.",
    setup: "",
    startSceneId: "phone-ring",
    scenes: {
        "phone-ring": {
            type: "decision",
            id: "phone-ring",
            speaker: "3:42 عصرًا",
            prompt: "هاتفك يرنّ.",
            choices: [],
        },

        "outcome-gave-password": {
            type: "outcome",
            id: "outcome-gave-password",
            speaker: "ما الذي حدث",
            attackerWon: true,
            narration:
                "أَعْطَيْتَ كَلِمَةَ المُرُورِ. شَكَرَكَ المُتَّصِلُ بِحَرَارَةٍ وَأَنْهَى الاِتِّصَالَ. خِلَالَ عَشْرِ دَقَائِقَ سَجَّلَ أَحَدُهُمُ الدُّخُولَ إِلَى حِسَابِ Microsoft الخَاصِّ بِكَ مِنْ عُنْوَانِ IP خَارِجَ البِلَادِ. بَرِيدُكَ، وOneDrive، وTeams، كُلُّهَا صَارَتْ مُتَاحَةً لَهُ. شَرِكَةُ Microsoft لَا تَتَّصِلُ أَبَدًا لِتَطْلُبَ كَلِمَةَ مُرُورِكَ. أَبَدًا. إِنِ اتَّصَلَ أَحَدٌ، فَهُوَ لَيْسَ Microsoft.",
            nextId: "debrief",
        },
        "outcome-asked-verify": {
            type: "outcome",
            id: "outcome-asked-verify",
            speaker: "ما الذي حدث",
            attackerWon: false,
            narration:
                "طَلَبْتَ رَقْمَ مُوَظَّفِهِ وَقُلْتَ إِنَّكَ سَتُعَاوِدُ الاِتِّصَالَ بِـ Microsoft عَلَى الرَّقْمِ المَنْشُورِ عَلَى مَوْقِعِهِمْ. حَدَثَتْ هَنَةٌ. تَمْتَمَ بِشَيْءٍ عَنْ «قُيُودٍ فِي النِّظَامِ» وَأَنْهَى الاِتِّصَالَ. وُكَلَاءُ الدَّعْمِ الحَقِيقِيُّونَ يَسْتَطِيعُونَ إِثْبَاتَ هُوِيَّتِهِمْ؛ المُحْتَالُونَ لَا يَسْتَطِيعُونَ. هَكَذَا تَعْرِفُ.",
            nextId: "debrief",
        },
        "outcome-hung-up": {
            type: "outcome",
            id: "outcome-hung-up",
            speaker: "ما الذي حدث",
            attackerWon: false,
            narration:
                "أَنْهَيْتَ الاِتِّصَالَ وَذَهَبْتَ إِلَى microsoft.com/support. أَكَّدَتْ Microsoft الحَقِيقِيَّةُ أَنَّهَا لَا تَتَّصِلُ أَبَدًا بِالعُمَلَاءِ لِتَطْلُبَ كَلِمَاتِ المُرُورِ. فَشِلَ الهُجُومُ لِأَنَّكَ لَمْ تَثِقْ بِمُكَالَمَةٍ وَارِدَةٍ. التَّحَقُّقُ الصَّادِرُ عَنْكَ، أَيِ البَحْثُ عَنِ الرَّقْمِ بِنَفْسِكَ، هُوَ أَبْسَطُ دِفَاعٍ ضِدَّ التَّصَيُّدِ الصَّوْتِيِّ.",
            nextId: "debrief",
        },
        "debrief": {
            type: "debrief",
            id: "debrief",
            speaker: "الخلاصة",
            takeaway:
                "Microsoft وApple وGoogle لَنْ يَتَّصِلُوا بِكَ أَبَدًا لِيَطْلُبُوا كَلِمَةَ مُرُورِكَ. إِنْ فَعَلَ أَحَدُهُمْ، فَالأَمْرُ احْتِيَالٌ.",
            lesson:
                "يَنْجَحُ التَّصَيُّدُ الصَّوْتِيُّ لِأَنَّ المُتَّصِلَ يَتَحَكَّمُ فِي السَّرْدِ: يَصْنَعُ الإِلْحَاحَ، وَالسُّلْطَةَ، وَرُوحَ المُسَاعَدَةِ فِي دَقِيقَةٍ وَاحِدَةٍ. كَسْرُ هَذَا السِّينَارِيُو، بِطَلَبِ التَّحَقُّقِ أَوْ مُعَاوَدَةِ الاِتِّصَالِ عَلَى رَقْمٍ مَوْثُوقٍ، يَنْسِفُ هَذَا الاِدِّعَاءَ. لَا جَوَابَ لَدَى المُحْتَالِ عَلَى ذَلِكَ.",
        },
    },
};

/**
 * Phone-call config used by ScenarioRunner to render the PhoneCall
 * component. Audio paths are filled by the runner via callerAudioPath
 * once locale is known.
 */
export const vishingCallConfig = {
    callerName: "دعم Microsoft",
    callerNumber: "+1 (800) 642-7676",
    lines: [
        {
            text: "مَرْحَبًا، مَعَكَ ديفيد مِنْ دَعْمِ Microsoft. نَتَّصِلُ بِكَ لِأَنَّ نِظَامَنَا رَصَدَ نَشَاطًا مَشْبُوهًا عَلَى حِسَابِكَ فِي Microsoft.",
            speed: 32,
            hold: 900,
            audio: "/audio/ar/vishing-helpdesk/caller-01.mp3",
        },
        {
            text: "رُبَّمَا دَخَلَ أَحَدُهُمْ إِلَى حِسَابِكَ مِنْ جِهَازٍ غَيْرِ مَعْرُوفٍ. نَحْتَاجُ إِلَى التَّحَقُّقِ مِنْ هُوِيَّتِكَ لِتَأْمِينِ الحِسَابِ قَبْلَ أَنْ تَتَسَرَّبَ أَيُّ بَيَانَاتٍ.",
            speed: 30,
            hold: 900,
            audio: "/audio/ar/vishing-helpdesk/caller-02.mp3",
        },
        {
            text: "هَلْ يُمْكِنُكَ مِنْ فَضْلِكَ تَأْكِيدُ البَرِيدِ وَكَلِمَةِ المُرُورِ المُرْتَبِطَيْنِ بِحِسَابِكَ فِي Microsoft لِنُجْرِيَ فَحْصًا أَمْنِيًّا؟",
            speed: 32,
            hold: 600,
            audio: "/audio/ar/vishing-helpdesk/caller-03.mp3",
        },
    ],
    choices: [
        {
            label: "«حسنًا، سأُعطيك كلمة المرور…»",
            nextId: "outcome-gave-password",
        },
        {
            label: "«ما رقم موظّفك؟ أودّ التحقّق من أنّ هذا فعلًا Microsoft.»",
            nextId: "outcome-asked-verify",
        },
        {
            label: "«سأبحث في microsoft.com بنفسي. شكرًا.»",
            nextId: "outcome-hung-up",
        },
    ],
};
