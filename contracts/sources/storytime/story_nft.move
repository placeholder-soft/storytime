module storytime::story_nft {
    use std::string::{utf8, String};
    use sui::object::{Self, ID, UID};
    use sui::transfer;
    use sui::tx_context::{Self, sender, TxContext};

    use sui::package;
    use sui::display;

    struct ChapterNFT has key, store {
        id: UID,
        chapter_number: u64,
        content: vector<u8> 
    }

    struct StoryNFT has key, store {
        id: UID,
        /// Name for the token
        name: vector<u8>,
        /// URL for the token
        image_url: vector<u8>,

        chapters: vector<ChapterNFT>,

        auther: address,
    }

    // ====
    /// One-Time-Witness for the module.
    struct STORY_NFT has drop {}

    fun init(otw: STORY_NFT, ctx: &mut TxContext) {
        let keys = vector[
            utf8(b"name"),
            utf8(b"link"),
            utf8(b"image_url"),
            utf8(b"description"),
            utf8(b"project_url"),
            utf8(b"creator"),
        ];

        let values = vector[
            // For `name` one can use the `Hero.name` property
            utf8(b"{name}"),
            // For `link` one can build a URL using an `id` property
            utf8(b"https://story.storytime.one/{id}"),
            // For `image_url` use an IPFS template + `image_url` property.
            utf8(b"https://image.storytime.one/images/{image_url}"),
            // Description is static for all `Hero` objects.
            utf8(b"A true Storytime of the Sui ecosystem!"),
            // Project URL is usually static
            utf8(b"https://app.storytime.one"),
            // Creator field can be any
            utf8(b"Storytime"),
        ];

        // Claim the `Publisher` for the package!
        let publisher = package::claim(otw, ctx);

        // Get a new `Display` object for the `Hero` type.
        let display = display::new_with_fields<StoryNFT>(
            &publisher, keys, values, ctx
        );

        // Commit first version of `Display` to apply changes.
        display::update_version(&mut display);

        transfer::public_transfer(publisher, sender(ctx));
        transfer::public_transfer(display, sender(ctx));
    }

    // ===== Entrypoints =====

    public fun mint(name: vector<u8>, image_url: vector<u8>, ctx: &mut TxContext) {
        let sender = tx_context::sender(ctx);
        let id = object::new(ctx);
        let chapters = vector[];
        let nft = StoryNFT { 
            id, 
            name, 
            image_url, 
            chapters, 
            auther: sender 
        };

        transfer::public_transfer(nft, sender);
    }

    /// Transfer `nft` to `recipient`
    public fun transfer(
        nft: StoryNFT, recipient: address, _: &mut TxContext
    ) {
        transfer::public_transfer(nft, recipient)
    }
}



#[test_only]
module storytime::story_nft_tests {
    use storytime::story_nft::{Self, StoryNFT};
    use sui::test_scenario as ts;
    use sui::transfer;
    use std::string::{String};

    #[test]
    fun mint_transfer_update() {
        let addr1 = @0xA;
        let addr2 = @0xB;
        // create the NFT
        let scenario = ts::begin(addr1);
        {
            story_nft::mint(b"test", b"images", ts::ctx(&mut scenario))
        };
        // send it from A to B
        ts::next_tx(&mut scenario, addr1);
        {
            let nft = ts::take_from_sender<StoryNFT>(&scenario);
            transfer::public_transfer(nft, addr2);
        };
        ts::end(scenario);
    }
}
