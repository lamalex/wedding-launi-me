import { useStore } from '@nanostores/react';
import { isLightboxOpen, lightboxIndex } from '../lightbox-store';


import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

export function ReactLightbox(props: { slides: { src: string }[] }) {

    const $isLightboxOpen = useStore(isLightboxOpen);
    const $lightboxIndex = useStore(lightboxIndex);

    return (
        <>
            <Lightbox
                open={$isLightboxOpen}
                close={() => isLightboxOpen.set(false)}
                slides={props.slides}
                index={$lightboxIndex}
                animation={{
                    fade: 0,
                    swipe: 0,

                    easing: {
                        fade: undefined,
                        swipe: undefined,
                        navigation: undefined,
                    }
                }}
            />
        </>
    );
}